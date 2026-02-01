'use client';

import { Check, CreditCard, Download, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth.store';

const plans = [
  {
    name: 'Free',
    price: 0,
    tier: 'free',
    features: ['1 Site', '1 License', '100 Credits/mo', 'Basic Support'],
  },
  {
    name: 'Starter',
    price: 29,
    tier: 'starter',
    features: ['5 Sites', '5 Licenses', '500 Credits/mo', 'Email Support'],
  },
  {
    name: 'Growth',
    price: 79,
    tier: 'growth',
    features: ['20 Sites', '20 Licenses', '2,000 Credits/mo', 'Priority Support', 'Custom Branding'],
  },
  {
    name: 'Agency',
    price: 199,
    tier: 'agency',
    features: ['Unlimited Sites', 'Unlimited Licenses', '10,000 Credits/mo', 'Phone Support', 'White Label', 'Custom Domain'],
  },
];

const mockInvoices = [
  { id: '1', date: '2026-01-01', amount: 199, status: 'paid' },
  { id: '2', date: '2025-12-01', amount: 199, status: 'paid' },
  { id: '3', date: '2025-11-01', amount: 199, status: 'paid' },
];

export default function BillingPage() {
  const { organization } = useAuthStore();
  const currentTier = organization?.tier || 'free';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500">Manage your subscription and invoices</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold capitalize">{currentTier}</p>
              <p className="text-gray-500">Your current subscription</p>
            </div>
            <Button variant="outline">Manage Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.tier}
              className={`relative ${
                plan.tier === currentTier ? 'border-blue-500 ring-1 ring-blue-500' : ''
              }`}
            >
              {plan.tier === currentTier && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600">
                  Current
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.tier === currentTier ? 'outline' : 'default'}
                  disabled={plan.tier === currentTier}
                >
                  {plan.tier === currentTier ? 'Current Plan' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/2027</p>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{formatDate(invoice.date)}</p>
                  <p className="text-sm text-gray-500">${invoice.amount}.00</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}