"use client";

import MainLayout from "@/components/ui/layout/MainLayout";
import SendSmsForm from "@/features/sms/components/SendSmsForm";
import SmsList from "@/features/sms/components/SmsList";
import { useSmsStore } from "@/stores/smsStore";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useMemo, useEffect } from "react";

export default function SmsPage() {
  const [mounted, setMounted] = useState(false);
  const smsLogs = useSmsStore((state) => state.getSmsLogs());
  const contacts = useSmsStore((state) => state.contacts);
  const groups = useSmsStore((state) => state.groups);
  const balance = useSmsStore((state) => state.balance);
  const smsCostPerMessage = useSmsStore((state) => state.smsCostPerMessage);
  const rechargeBalance = useSmsStore((state) => state.rechargeBalance);
  const [activeTab, setActiveTab] = useState("send");
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount);
    if (!isNaN(amount) && amount > 0) {
      rechargeBalance(amount);
      setRechargeAmount("");
      setIsRechargeOpen(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!mounted) {
      return {
        todayCount: 0,
        deliveredToday: 0,
        failedToday: 0,
        totalSent: 0,
        totalDelivered: 0,
        deliveryRate: "0",
        totalSpent: 0,
        contactsCount: 0,
        groupsCount: 0,
        balance: 0
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogs = smsLogs.filter(log => new Date(log.created_at) >= today);
    const deliveredToday = todayLogs.filter(log => log.status === "delivered").length;
    const failedToday = todayLogs.filter(log => log.status === "failed").length;
    const totalSent = smsLogs.length;
    const totalDelivered = smsLogs.filter(log => log.status === "delivered").length;
    const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : "0";
    const totalSpent = smsLogs.reduce((sum, log) => sum + (log.price || 0), 0);

    return {
      todayCount: todayLogs.length,
      deliveredToday,
      failedToday,
      totalSent,
      totalDelivered,
      deliveryRate,
      totalSpent,
      contactsCount: contacts.length,
      groupsCount: groups.length,
      balance
    };
  }, [smsLogs, contacts, groups, balance, mounted]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SMS Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage and send SMS to your clients</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Account Balance</p>
            <div className="flex items-center gap-3">
              <p className={`text-2xl font-bold ${
                stats.balance > 10 ? "text-green-600" : 
                stats.balance > 5 ? "text-yellow-600" : "text-red-600"
              }`}>${stats.balance.toFixed(2)}</p>
              <Dialog open={isRechargeOpen} onOpenChange={setIsRechargeOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    💳 Recharge
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Recharge Balance</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Current Balance</Label>
                      <div className="text-2xl font-bold text-green-600">
                        ${stats.balance.toFixed(2)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rechargeAmount">Recharge Amount ($)</Label>
                      <Input
                        id="rechargeAmount"
                        type="number"
                        step="0.01"
                        min="1"
                        placeholder="Enter amount"
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                      />
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-sm">
                      <p className="text-gray-600">SMS Cost: ${mounted ? smsCostPerMessage.toFixed(3) : "0.015"} per message</p>
                      {rechargeAmount && !isNaN(parseFloat(rechargeAmount)) && (
                        <p className="text-blue-600 font-semibold mt-1">
                          ≈ {Math.floor(parseFloat(rechargeAmount) / (mounted ? smsCostPerMessage : 0.015))} SMS messages
                        </p>
                      )}
                    </div>
                    <Button 
                      onClick={handleRecharge} 
                      className="w-full"
                      disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0}
                    >
                      Recharge ${rechargeAmount || "0.00"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              ${mounted ? smsCostPerMessage.toFixed(3) : "0.015"} per SMS
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today's SMS */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Today's SMS</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{stats.todayCount}</p>
                <p className="text-xs text-blue-600 mt-1">
                  ✓ {stats.deliveredToday} delivered · ✗ {stats.failedToday} failed
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">📊</span>
              </div>
            </div>
          </Card>

          {/* Total Sent */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Sent</p>
                <p className="text-3xl font-bold text-green-900 mt-2">{stats.totalSent}</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.deliveryRate}% delivery rate
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">📤</span>
              </div>
            </div>
          </Card>

          {/* Contacts */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Contacts</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{stats.contactsCount}</p>
                <p className="text-xs text-purple-600 mt-1">
                  {stats.groupsCount} groups created
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">👥</span>
              </div>
            </div>
          </Card>

          {/* Total Spent */}
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Spent</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">${stats.totalSpent.toFixed(2)}</p>
                <p className="text-xs text-orange-600 mt-1">
                  Avg ${stats.totalSent > 0 ? (stats.totalSpent / stats.totalSent).toFixed(3) : "0"} per SMS
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">💰</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="send">Send SMS</TabsTrigger>
            <TabsTrigger value="history">SMS History</TabsTrigger>
          </TabsList>

          {/* Send SMS Tab */}
          <TabsContent value="send" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Send Form - Takes 2 columns */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">✉️</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Compose Message</h2>
                      <p className="text-sm text-gray-500">Send SMS to individuals, contacts, or groups</p>
                    </div>
                  </div>
                  <SendSmsForm />
                </Card>
              </div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-4">
                {/* Quick Stats */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <span>⚡</span> Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Pending</span>
                      <span className="font-semibold text-yellow-600">
                        {smsLogs.filter(l => l.status === "pending").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Delivered</span>
                      <span className="font-semibold text-green-600">
                        {stats.totalDelivered}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Failed</span>
                      <span className="font-semibold text-red-600">
                        {smsLogs.filter(l => l.status === "failed").length}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <span>🕐</span> Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {!mounted ? (
                      <p className="text-sm text-gray-400 text-center py-4">
                        Loading activity...
                      </p>
                    ) : smsLogs.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">
                        No recent activity
                      </p>
                    ) : (
                      smsLogs.slice(0, 5).map((log, idx) => {
                        const contact = contacts.find(c => c.phone === log.to);
                        const displayName = contact ? contact.name : log.to;
                        
                        return (
                          <div key={log.sid} className="flex items-start gap-3 text-sm">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${
                              log.status === "delivered" ? "bg-green-500" :
                              log.status === "failed" ? "bg-red-500" : "bg-yellow-500"
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 truncate font-medium">{displayName}</p>
                              {contact && (
                                <p className="text-xs text-gray-400 truncate">{log.to}</p>
                              )}
                              <p className="text-xs text-gray-500">
                                {new Date(log.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* SMS History Tab */}
          <TabsContent value="history" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📜</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Message History</h2>
                    <p className="text-sm text-gray-500">View all sent messages and their status</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border rounded-lg text-sm">
                    <option>All Status</option>
                    <option>Delivered</option>
                    <option>Pending</option>
                    <option>Failed</option>
                  </select>
                  <select className="px-3 py-2 border rounded-lg text-sm">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>All time</option>
                  </select>
                </div>
              </div>
              <SmsList />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
