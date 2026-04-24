import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Plus, Trash2, Edit, AlertCircle } from 'lucide-react';
import { expenseCategories } from '../data/categories';

export function Budgets() {
  const { budgets, addBudget, updateBudget, deleteBudget } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    period: 'monthly' as 'monthly' | 'yearly',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.limit) {
      return;
    }

    if (editingBudget) {
      updateBudget(editingBudget, {
        category: formData.category,
        limit: parseFloat(formData.limit),
        period: formData.period,
      });
    } else {
      addBudget({
        category: formData.category,
        limit: parseFloat(formData.limit),
        period: formData.period,
      });
    }

    setFormData({
      category: '',
      limit: '',
      period: 'monthly',
    });
    setEditingBudget(null);
    setIsOpen(false);
  };

  const handleEdit = (budget: any) => {
    setFormData({
      category: budget.category,
      limit: budget.limit.toString(),
      period: budget.period,
    });
    setEditingBudget(budget.id);
    setIsOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({
        category: '',
        limit: '',
        period: 'monthly',
      });
      setEditingBudget(null);
    }
    setIsOpen(open);
  };

  const handleClose = () => {
    handleDialogOpenChange(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Budgets</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Set and track your spending limits</p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget' : 'Add New Budget'}
              </DialogTitle>
              <DialogDescription>
                Set a spending limit for a category
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit">Budget Limit</Label>
                <Input
                  id="limit"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.limit}
                  onChange={(e) =>
                    setFormData({ ...formData, limit: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select
                  value={formData.period}
                  onValueChange={(value: 'monthly' | 'yearly') =>
                    setFormData({ ...formData, period: value })
                  }
                >
                  <SelectTrigger id="period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                {editingBudget ? 'Update Budget' : 'Add Budget'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No budgets created yet</p>
            </CardContent>
          </Card>
        ) : (
          budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOverBudget = percentage > 100;
            const isWarning = percentage > 80 && percentage <= 100;
            const remaining = budget.limit - budget.spent;

            return (
              <Card key={budget.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>{budget.category}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(budget)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteBudget(budget.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 capitalize">
                    {budget.period} budget
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Spent</span>
                      <span className="font-medium">
                        ₹{budget.spent.toLocaleString()} / ₹
                        {budget.limit.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className="h-2"
                    />
                    <p className="text-xs text-gray-600">
                      {percentage.toFixed(0)}% used
                    </p>
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      isOverBudget
                        ? 'bg-red-50 dark:bg-red-900/20'
                        : isWarning
                        ? 'bg-yellow-50 dark:bg-yellow-900/20'
                        : 'bg-green-50 dark:bg-green-900/20'
                    }`}
                  >
                    {isOverBudget ? (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">
                            Over Budget
                          </p>
                          <p className="text-xs text-red-700 dark:text-red-300">
                            ₹{Math.abs(remaining).toLocaleString()} over limit
                          </p>
                        </div>
                      </div>
                    ) : isWarning ? (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Almost at limit
                          </p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-300">
                            ₹{remaining.toLocaleString()} remaining
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          On Track
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          ₹{remaining.toLocaleString()} remaining
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}