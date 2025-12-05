"use client";

import { useSmsStore } from "@/stores/smsStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, AlertCircle, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function AccountBalanceCard() {
  const balance = useSmsStore((state) => state.balance);
  const smsCostPerMessage = useSmsStore((state) => state.smsCostPerMessage);
  const rechargeBalance = useSmsStore((state) => state.rechargeBalance);
  
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const estimatedMessages = Math.floor(balance / smsCostPerMessage);
  const isLowBalance = balance < 10;

  const rechargePackages = [
    { amount: 10, messages: Math.floor(10 / smsCostPerMessage), bonus: 0 },
    { amount: 50, messages: Math.floor(50 / smsCostPerMessage), bonus: 5 },
    { amount: 100, messages: Math.floor(100 / smsCostPerMessage), bonus: 15 },
    { amount: 250, messages: Math.floor(250 / smsCostPerMessage), bonus: 50 },
    { amount: 500, messages: Math.floor(500 / smsCostPerMessage), bonus: 125 },
  ];

  const handleRecharge = () => {
    const amount = selectedPackage !== null ? selectedPackage : parseFloat(rechargeAmount);
    if (amount && amount > 0) {
      rechargeBalance(amount);
      setRechargeAmount("");
      setSelectedPackage(null);
      setIsRechargeOpen(false);
    }
  };

  const handlePackageSelect = (amount: number) => {
    setSelectedPackage(amount);
    setRechargeAmount(amount.toString());
  };

  const handlePayNow = () => {
    handleRecharge();
  };

  const canProceed = rechargeAmount && parseFloat(rechargeAmount) > 0;

  return (
    <Card className={`${isLowBalance ? 'border-red-300 bg-red-50' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-gray-600">Account Balance</CardTitle>
          <CardDescription className="text-xs mt-1">
            ~{estimatedMessages.toLocaleString()} SMS remaining
          </CardDescription>
        </div>
        <Wallet className={`h-5 w-5 ${isLowBalance ? 'text-red-500' : 'text-primary'}`} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              ${balance.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">USD</span>
          </div>

          {isLowBalance && (
            <div className="flex items-start gap-2 p-3 bg-red-100 border border-red-300 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-800">
                <p className="font-semibold">Low Balance Alert</p>
                <p>Your balance is running low. Recharge now to continue sending SMS.</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <TrendingUp className="h-3 w-3" />
            <span>Rate: ${smsCostPerMessage.toFixed(3)} per SMS</span>
          </div>

          <Dialog open={isRechargeOpen} onOpenChange={setIsRechargeOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Recharge Balance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Recharge Your Account</DialogTitle>
                <DialogDescription>
                  Select a package or enter a custom amount to add to your balance
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Quick Recharge Packages */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Quick Packages</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {rechargePackages.map((pkg) => (
                      <button
                        key={pkg.amount}
                        onClick={() => handlePackageSelect(pkg.amount)}
                        className={`p-3 border-2 rounded-lg text-left transition-all hover:border-primary ${
                          selectedPackage === pkg.amount
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="text-xl font-bold text-gray-900">${pkg.amount}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          ~{pkg.messages.toLocaleString()} SMS
                        </div>
                        {pkg.bonus > 0 && (
                          <div className="text-xs text-primary font-semibold mt-1">
                            +${pkg.bonus} bonus
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or custom amount</span>
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Custom Amount (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="custom-amount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={rechargeAmount}
                      onChange={(e) => {
                        setRechargeAmount(e.target.value);
                        setSelectedPackage(null);
                      }}
                      placeholder="Enter amount"
                      className="pl-7"
                    />
                  </div>
                  {rechargeAmount && parseFloat(rechargeAmount) > 0 && (
                    <p className="text-xs text-gray-600">
                      ≈ {Math.floor(parseFloat(rechargeAmount) / smsCostPerMessage).toLocaleString()} SMS messages
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Balance:</span>
                    <span className="font-semibold">${balance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recharge Amount:</span>
                    <span className="font-semibold text-primary">
                      ${(parseFloat(rechargeAmount) || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-gray-900 font-semibold">New Balance:</span>
                    <span className="font-bold text-lg text-primary">
                      ${(balance + (parseFloat(rechargeAmount) || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handlePayNow}
                  disabled={!canProceed}
                  className="w-full bg-primary hover:bg-primary-dark"
                  size="lg"
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  {canProceed 
                    ? `Pay Now - $${(parseFloat(rechargeAmount) || 0).toFixed(2)}`
                    : 'Select Amount to Continue'
                  }
                </Button>
                
                {canProceed && (
                  <p className="text-xs text-center text-gray-500">
                    Click to add funds to your account instantly
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
