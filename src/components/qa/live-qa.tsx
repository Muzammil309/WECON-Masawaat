'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { HelpCircle, ThumbsUp, MessageSquare, Send, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface Question {
  id: string
  content: string
  votes: number
  answered: boolean
  answer: string | null
  created_at: string
  user_id: string
  profile: {
    full_name: string | null
    email: string
  }
}

interface LiveQAProps {
  sessionId: string
  isOrganizer?: boolean
}

export function LiveQA({ sessionId, isOrganizer = false }: LiveQAProps) {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [answerText, setAnswerText] = useState('')
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    fetchQuestions()
    setupRealtimeSubscription()
    
    return () => {
      supabase.removeAllChannels()
    }
  }, [user, sessionId])

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('em_qa_questions')
        .select(`
          *,
          profile:em_profiles(full_name, email)
        `)
        .eq('session_id', sessionId)
        .order('votes', { ascending: false })
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching questions:', error)
        toast.error('Failed to load questions')
      } else {
        setQuestions(data || [])
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel(`qa-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'em_qa_questions',
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          fetchQuestions() // Refetch to get updated data with profiles
        }
      )
      .subscribe()
  }

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim() || !user || isSending) return

    setIsSending(true)

    try {
      const { error } = await supabase
        .from('em_qa_questions')
        .insert({
          content: newQuestion.trim(),
          session_id: sessionId,
          user_id: user.id,
        })

      if (error) {
        toast.error('Failed to submit question: ' + error.message)
      } else {
        setNewQuestion('')
        toast.success('Question submitted!')
      }
    } catch (error) {
      toast.error('Failed to submit question')
    } finally {
      setIsSending(false)
    }
  }

  const voteQuestion = async (questionId: string) => {
    if (!user) return

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('em_qa_votes')
        .select('id')
        .eq('question_id', questionId)
        .eq('user_id', user.id)
        .single()

      if (existingVote) {
        // Remove vote
        await supabase
          .from('em_qa_votes')
          .delete()
          .eq('question_id', questionId)
          .eq('user_id', user.id)

        // Decrease vote count - get current votes first
        const { data: currentQuestion } = await supabase
          .from('em_qa_questions')
          .select('votes')
          .eq('id', questionId)
          .single()

        if (currentQuestion) {
          await supabase
            .from('em_qa_questions')
            .update({ votes: Math.max(0, currentQuestion.votes - 1) })
            .eq('id', questionId)
        }
      } else {
        // Add vote
        await supabase
          .from('em_qa_votes')
          .insert({
            question_id: questionId,
            user_id: user.id,
          })

        // Increase vote count - get current votes first
        const { data: currentQuestion } = await supabase
          .from('em_qa_questions')
          .select('votes')
          .eq('id', questionId)
          .single()

        if (currentQuestion) {
          await supabase
            .from('em_qa_questions')
            .update({ votes: currentQuestion.votes + 1 })
            .eq('id', questionId)
        }
      }
    } catch (error) {
      toast.error('Failed to vote')
    }
  }

  const answerQuestion = async (questionId: string) => {
    if (!answerText.trim() || !isOrganizer) return

    try {
      const { error } = await supabase
        .from('em_qa_questions')
        .update({
          answer: answerText.trim(),
          answered: true,
        })
        .eq('id', questionId)

      if (error) {
        toast.error('Failed to answer question: ' + error.message)
      } else {
        setAnswerText('')
        setAnsweringQuestionId(null)
        toast.success('Question answered!')
      }
    } catch (error) {
      toast.error('Failed to answer question')
    }
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    return email.charAt(0).toUpperCase()
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Q&A Unavailable</CardTitle>
          <CardDescription>
            Please sign in to participate in the Q&A.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Live Q&A
        </CardTitle>
        <CardDescription>
          Ask questions and vote on others' questions
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Question Submission */}
        <div className="border-b p-4">
          <form onSubmit={submitQuestion} className="space-y-3">
            <Textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask your question..."
              disabled={isSending}
              rows={3}
            />
            <Button type="submit" disabled={isSending || !newQuestion.trim()}>
              <Send className="mr-2 h-4 w-4" />
              {isSending ? 'Submitting...' : 'Submit Question'}
            </Button>
          </form>
        </div>

        {/* Questions List */}
        <ScrollArea className="flex-1 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No questions yet. Be the first to ask!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <Card key={question.id} className="p-4">
                  <div className="space-y-3">
                    {/* Question Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {getInitials(question.profile.full_name, question.profile.email)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {question.profile.full_name || question.profile.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(question.created_at), 'MMM d, HH:mm')}
                          </p>
                        </div>
                      </div>
                      {question.answered && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Answered
                        </Badge>
                      )}
                    </div>

                    {/* Question Content */}
                    <p className="text-sm">{question.content}</p>

                    {/* Answer */}
                    {question.answer && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium mb-1">Answer:</p>
                        <p className="text-sm">{question.answer}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => voteQuestion(question.id)}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {question.votes}
                      </Button>

                      {isOrganizer && !question.answered && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAnsweringQuestionId(
                            answeringQuestionId === question.id ? null : question.id
                          )}
                        >
                          <MessageSquare className="mr-1 h-4 w-4" />
                          Answer
                        </Button>
                      )}
                    </div>

                    {/* Answer Form */}
                    {isOrganizer && answeringQuestionId === question.id && (
                      <div className="space-y-2 pt-2 border-t">
                        <Textarea
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="Type your answer..."
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => answerQuestion(question.id)}
                            disabled={!answerText.trim()}
                          >
                            Submit Answer
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAnsweringQuestionId(null)
                              setAnswerText('')
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
