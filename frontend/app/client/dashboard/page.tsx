import React from 'react'
import AccountBalanceCard from '@/components/ui/AccountBalanceCard'

const page = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your SMS dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AccountBalanceCard />
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages Sent</h3>
          <p className="text-3xl font-bold text-primary">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Rate</h3>
          <p className="text-3xl font-bold text-green-600">98.5%</p>
        </div>
      </div>
    </div>
  )
}

export default page
