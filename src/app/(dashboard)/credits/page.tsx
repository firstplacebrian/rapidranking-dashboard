'use client';

import { Coins, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockTransactions = [
  {
    id: '1',
    type: 'usage',
    amount: -50,
    description: 'RapidScan - GeoGrid scan',
    action: 'geogrid_scan',
    createdAt: '2026-01-31T14:30:00Z',
  },
  {
    id: '2',
    type: 'usage',
    amount: -25,
    description: 'RapidBuild - Content generation',
    action: 'content_generation',
    createdAt: '2026-01-31T12:15:00Z',
  },
  {
    id: '3',
    type: 'purchase',
    amount: 1000,
    description: 'Credit pack purchase',
    action: 'purchase',
    createdAt: '2026-01-30T09:00:00Z',
  },
  {
    id: '4',
    type: 'usage',
    amount: -100,
    description: 'RapidReport - Monthly report',
    action: 'report_generation',
    createdAt: '2026-01-29T16:45:00Z',
  },
  {
    id: '5',
    type: 'bonus',
    amount: 500,
    description: 'Welcome bonus',
    action: 'bonus',
    createdAt: '2026-01-15T10:00:00Z',
  },
];

const creditPacks = [
  { credits: 500, price: 25, popular: false },
  { credits: 1000, price: 45, popular: true },
  { credits: 2500, price: 100, popular: false },
  { credits: 5000, price: 175, popular: false },
];

export default function CreditsPage() {
  const currentBalance = 2450;
  const monthlyUsage = 175;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
            <p className="text-3xl font-bold">{currentBalance.toLocaleString()}</p>
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
            <p className="text-3xl font-bold">{monthlyUsage}</p>
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
            <p className="text-3xl font-bold">~42</p>
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
          <div className="space-y-3">
            {mockTransactions.map((tx) => (
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
        </CardContent>
      </Card>
    </div>
  );
}