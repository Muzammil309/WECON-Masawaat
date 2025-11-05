'use client'

import { useState } from 'react'
import { Settings, Mail, CreditCard, Shield, Bell, Link as LinkIcon, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function SettingsContent() {
  const [saving, setSaving] = useState(false)

  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`${section} settings saved successfully!`)
    } catch (err) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-[28px]">
      <Tabs defaultValue="general" className="space-y-[24px]">
        <TabsList
          className="inline-flex gap-[8px] p-[8px] rounded-[16px]"
          style={{
            background: 'rgba(26, 31, 55, 0.5)',
            border: '2px solid #151515',
          }}
        >
          <TabsTrigger
            value="general"
            className="px-[20px] py-[12px] rounded-[12px] text-[14px] font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <Settings className="h-[16px] w-[16px] mr-[8px]" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="px-[20px] py-[12px] rounded-[12px] text-[14px] font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <Mail className="h-[16px] w-[16px] mr-[8px]" />
            Email
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="px-[20px] py-[12px] rounded-[12px] text-[14px] font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <CreditCard className="h-[16px] w-[16px] mr-[8px]" />
            Payment
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="px-[20px] py-[12px] rounded-[12px] text-[14px] font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <Shield className="h-[16px] w-[16px] mr-[8px]" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="px-[20px] py-[12px] rounded-[12px] text-[14px] font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <Bell className="h-[16px] w-[16px] mr-[8px]" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="px-[20px] py-[12px] rounded-[12px] text-[14px] font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <LinkIcon className="h-[16px] w-[16px] mr-[8px]" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="vision-glass-card p-[32px]">
            <h3 className="text-[24px] font-bold text-white mb-[24px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              General Settings
            </h3>
            <div className="space-y-[24px]">
              <div>
                <label className="block text-[14px] font-medium text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                  Platform Name
                </label>
                <input
                  type="text"
                  defaultValue="WECON Event Management"
                  className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
                  style={{
                    background: 'rgba(26, 31, 55, 0.5)',
                    border: '2px solid #151515',
                    fontFamily: '"Plus Jakarta Display", sans-serif',
                  }}
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                  Timezone
                </label>
                <select
                  defaultValue="Asia/Karachi"
                  className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
                  style={{
                    background: 'rgba(26, 31, 55, 0.5)',
                    border: '2px solid #151515',
                    fontFamily: '"Plus Jakarta Display", sans-serif',
                  }}
                >
                  <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                  <option value="America/New_York">America/New York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                </select>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                  Currency
                </label>
                <select
                  defaultValue="PKR"
                  className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
                  style={{
                    background: 'rgba(26, 31, 55, 0.5)',
                    border: '2px solid #151515',
                    fontFamily: '"Plus Jakarta Display", sans-serif',
                  }}
                >
                  <option value="PKR">Pakistani Rupee (PKR)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="AED">UAE Dirham (AED)</option>
                </select>
              </div>

              <button
                onClick={() => handleSave('General')}
                disabled={saving}
                className="px-[24px] py-[12px] rounded-[12px] text-[14px] font-medium transition-all flex items-center gap-[8px]"
                style={{
                  background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                  color: '#fff',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <Save className="h-[16px] w-[16px]" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <div className="vision-glass-card p-[32px]">
            <h3 className="text-[24px] font-bold text-white mb-[24px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Email Settings
            </h3>
            <div className="space-y-[24px]">
              <div>
                <label className="block text-[14px] font-medium text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                  SMTP Host
                </label>
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
                  style={{
                    background: 'rgba(26, 31, 55, 0.5)',
                    border: '2px solid #151515',
                    fontFamily: '"Plus Jakarta Display", sans-serif',
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-[16px]">
                <div>
                  <label className="block text-[14px] font-medium text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    placeholder="587"
                    className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
                    style={{
                      background: 'rgba(26, 31, 55, 0.5)',
                      border: '2px solid #151515',
                      fontFamily: '"Plus Jakarta Display", sans-serif',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    Encryption
                  </label>
                  <select
                    defaultValue="TLS"
                    className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
                    style={{
                      background: 'rgba(26, 31, 55, 0.5)',
                      border: '2px solid #151515',
                      fontFamily: '"Plus Jakarta Display", sans-serif',
                    }}
                  >
                    <option value="TLS">TLS</option>
                    <option value="SSL">SSL</option>
                    <option value="NONE">None</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                  From Email
                </label>
                <input
                  type="email"
                  placeholder="noreply@wecon.events"
                  className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
                  style={{
                    background: 'rgba(26, 31, 55, 0.5)',
                    border: '2px solid #151515',
                    fontFamily: '"Plus Jakarta Display", sans-serif',
                  }}
                />
              </div>

              <button
                onClick={() => handleSave('Email')}
                disabled={saving}
                className="px-[24px] py-[12px] rounded-[12px] text-[14px] font-medium transition-all flex items-center gap-[8px]"
                style={{
                  background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                  color: '#fff',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <Save className="h-[16px] w-[16px]" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <div className="vision-glass-card p-[32px]">
            <h3 className="text-[24px] font-bold text-white mb-[24px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Payment Settings
            </h3>
            <div className="space-y-[24px]">
              <div>
                <label className="block text-[14px] font-medium text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                  Stripe Publishable Key
                </label>
                <input
                  type="text"
                  placeholder="pk_test_..."
                  className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
                  style={{
                    background: 'rgba(26, 31, 55, 0.5)',
                    border: '2px solid #151515',
                    fontFamily: '"Plus Jakarta Display", sans-serif',
                  }}
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                  Stripe Secret Key
                </label>
                <input
                  type="password"
                  placeholder="sk_test_..."
                  className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
                  style={{
                    background: 'rgba(26, 31, 55, 0.5)',
                    border: '2px solid #151515',
                    fontFamily: '"Plus Jakarta Display", sans-serif',
                  }}
                />
              </div>

              <div className="flex items-center gap-[12px]">
                <input
                  type="checkbox"
                  id="test-mode"
                  defaultChecked
                  className="w-[20px] h-[20px] rounded-[6px]"
                />
                <label htmlFor="test-mode" className="text-[14px] text-gray-300" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                  Enable Test Mode
                </label>
              </div>

              <button
                onClick={() => handleSave('Payment')}
                disabled={saving}
                className="px-[24px] py-[12px] rounded-[12px] text-[14px] font-medium transition-all flex items-center gap-[8px]"
                style={{
                  background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                  color: '#fff',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <Save className="h-[16px] w-[16px]" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="vision-glass-card p-[32px]">
            <h3 className="text-[24px] font-bold text-white mb-[24px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Security Settings
            </h3>
            <div className="space-y-[24px]">
              <div className="flex items-center justify-between p-[16px] rounded-[12px] bg-white/5">
                <div>
                  <h4 className="text-[16px] font-medium text-white mb-[4px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    Two-Factor Authentication
                  </h4>
                  <p className="text-[12px] text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <button
                  className="px-[16px] py-[8px] rounded-[10px] text-[14px] font-medium transition-all"
                  style={{
                    background: 'rgba(26, 31, 55, 0.5)',
                    border: '2px solid #151515',
                    color: '#fff',
                  }}
                >
                  Enable
                </button>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
                  style={{
                    background: 'rgba(26, 31, 55, 0.5)',
                    border: '2px solid #151515',
                    fontFamily: '"Plus Jakarta Display", sans-serif',
                  }}
                />
              </div>

              <button
                onClick={() => handleSave('Security')}
                disabled={saving}
                className="px-[24px] py-[12px] rounded-[12px] text-[14px] font-medium transition-all flex items-center gap-[8px]"
                style={{
                  background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                  color: '#fff',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <Save className="h-[16px] w-[16px]" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <div className="vision-glass-card p-[32px]">
            <h3 className="text-[24px] font-bold text-white mb-[24px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Notification Settings
            </h3>
            <div className="space-y-[16px]">
              {[
                { label: 'New Event Registration', description: 'Get notified when someone registers for an event' },
                { label: 'Ticket Purchase', description: 'Get notified when a ticket is purchased' },
                { label: 'Check-in Alerts', description: 'Get notified when attendees check in' },
                { label: 'Daily Summary', description: 'Receive a daily summary of platform activity' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-[16px] rounded-[12px] bg-white/5">
                  <div>
                    <h4 className="text-[16px] font-medium text-white mb-[4px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                      {item.label}
                    </h4>
                    <p className="text-[12px] text-gray-400">{item.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-[20px] h-[20px] rounded-[6px]"
                  />
                </div>
              ))}

              <button
                onClick={() => handleSave('Notifications')}
                disabled={saving}
                className="px-[24px] py-[12px] rounded-[12px] text-[14px] font-medium transition-all flex items-center gap-[8px] mt-[24px]"
                style={{
                  background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                  color: '#fff',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <Save className="h-[16px] w-[16px]" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations">
          <div className="vision-glass-card p-[32px]">
            <h3 className="text-[24px] font-bold text-white mb-[24px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Integrations
            </h3>
            <div className="space-y-[16px]">
              {[
                { name: 'Zoom', description: 'Connect Zoom for virtual events', icon: '📹' },
                { name: 'Google Calendar', description: 'Sync events with Google Calendar', icon: '📅' },
                { name: 'Mailchimp', description: 'Sync attendees with Mailchimp', icon: '📧' },
                { name: 'Slack', description: 'Send notifications to Slack', icon: '💬' },
              ].map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-[16px] rounded-[12px] bg-white/5">
                  <div className="flex items-center gap-[12px]">
                    <span className="text-[32px]">{integration.icon}</span>
                    <div>
                      <h4 className="text-[16px] font-medium text-white mb-[4px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                        {integration.name}
                      </h4>
                      <p className="text-[12px] text-gray-400">{integration.description}</p>
                    </div>
                  </div>
                  <button
                    className="px-[16px] py-[8px] rounded-[10px] text-[14px] font-medium transition-all"
                    style={{
                      background: 'rgba(26, 31, 55, 0.5)',
                      border: '2px solid #151515',
                      color: '#fff',
                    }}
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

