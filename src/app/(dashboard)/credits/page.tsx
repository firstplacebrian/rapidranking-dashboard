'use client';

import { useState, useEffect } from 'react';
import { Coins, TrendingUp, TrendingDown, CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';

interface CreditBalance {
  balance: number;
  monthlyUsage: number;
  monthlyLimit: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  action: string | null;
  createdAt: string;
}

const creditPacks = [
  { credits: 500, price: 25, popular: false },
  { credits: 1000, price: 45, popular: true },
  { credits: 2500, price: 100, popular: false },
  { credits: 5000, price: 175, popular: false },
];

export default function CreditsPage() {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<typeof creditPacks[0] | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceData, historyData] = await Promise.all([
        api.get<CreditBalance>('/credits/balance'),
        api.get<Transaction[]>('/credits/history'),
      ]);
      setBalance(balanceData);
      setTransactions(historyData);
    } catch (error) {
      toast.error('Failed to load credits data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyCredits = async () => {
    if (!selectedPack) return;

    setIsPurchasing(true);
    try {
      await api.post('/credits/add', {
        amount: selectedPack.credits,
        description: `Purchased ${selectedPack.credits} credits`,
      });
      toast.success(`Added ${selectedPack.credits} credits!`);
      setIsBuyDialogOpen(false);
      setSelectedPack(null);
      fetchData(); // Refresh data
    } catch (error: any) {
      toast.error(error.message || 'Failed to purchase credits');
    } finally {
      setIsPurchasing(false);
    }
  };

  const openBuyDialog = (pack: typeof creditPacks[0]) => {
    setSelectedPack(pack);
    setIsBuyDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const estimatedDays = balance
    ? balance.monthlyUsage > 0
      ? Math.round((balance.balance / balance.monthlyUsage) * 30)
      : 999
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Credits</h1>
        <p className="text-gray-500">Manage your credit balance and usage</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Current Balance
            </CardTitle>
            <Coins className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{balance?.balance.toLocaleString() || 0}</p>
            <p className="text-sm text-gray-500">credits available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              This Month
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{balance?.monthlyUsage || 0}</p>
            <p className="text-sm text-gray-500">credits used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Estimated Days
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">~{estimatedDays > 999 ? '∞' : estimatedDays}</p>
            <p className="text-sm text-gray-500">at current usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Buy Credits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Buy Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditPacks.map((pack) => (
              <div
                key={pack.credits}
                className={`relative border rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer ${
                  pack.popular ? 'border-blue-500 ring-1 ring-blue-500' : ''
                }`}
                onClick={() => openBuyDialog(pack)}
              >
                {pack.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600">
                    Popular
                  </Badge>
                )}
                <p className="text-2xl font-bold mt-2">{pack.credits.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">credits</p>
                <p className="text-xl font-semibold mt-2">${pack.price}</p>
                <Button className="w-full mt-3" variant={pack.popular ? 'default' : 'outline'}>
                  Buy Now
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      {tx.amount > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(tx.createdAt)}</p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Buy Credits Dialog */}
      <Dialog open={isBuyDialogOpen} onOpenChange={setIsBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              You are about to purchase {selectedPack?.credits.toLocaleString()} credits for ${selectedPack?.price}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-4xl font-bold">{selectedPack?.credits.toLocaleString()}</p>
            <p className="text-gray-500">credits</p>
            <p className="text-2xl font-semibold mt-2">${selectedPack?.price}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBuyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBuyCredits} disabled={isPurchasing}>
              {isPurchasing ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}