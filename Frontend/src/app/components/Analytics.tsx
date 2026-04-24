import { useFinance } from '../context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export function Analytics() {
  const { transactions } = useFinance();

  // Calculate category breakdown
  const categoryBreakdown = transactions.reduce(
    (acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        acc[t.category].income += t.amount;
      } else {
        acc[t.category].expense += t.amount;
      }
      return acc;
    },
    {} as Record<string, { income: number; expense: number }>
  );

  const categoryData = Object.entries(categoryBreakdown).map(([name, data]) => ({
    name,
    income: data.income,
    expense: data.expense,
  }));

  // Expense pie chart data
  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const expensePieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  // Income pie chart data
  const incomeByCategory = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomePieData = Object.entries(incomeByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  // Monthly comparison (mock data showing trend)
  const monthlyComparison = [
    { month: 'Oct', income: 4800, expenses: 3200, savings: 1600 },
    { month: 'Nov', income: 5200, expenses: 3500, savings: 1700 },
    { month: 'Dec', income: 5500, expenses: 4200, savings: 1300 },
    { month: 'Jan', income: 5000, expenses: 3800, savings: 1200 },
    { month: 'Feb', income: 5300, expenses: 3600, savings: 1700 },
    { 
      month: 'Mar', 
      income: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      expenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      savings: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
               transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#ef4444', '#84cc16'];

  // Calculate stats
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const avgTransaction = transactions.length > 0
    ? (totalIncome + totalExpenses) / transactions.length
    : 0;

  const savingsRate = totalIncome > 0
    ? ((totalIncome - totalExpenses) / totalIncome) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Detailed insights into your finances</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Savings Rate
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">
              {savingsRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Of total income saved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Transaction
            </CardTitle>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">
              ₹{avgTransaction.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Average transaction value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Transactions
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">
              {transactions.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              All time transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>6-Month Financial Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              <Bar dataKey="savings" fill="#3b82f6" name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expense" fill="#ef4444" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {expensePieData.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No expense data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensePieData.map((entry, index) => (
                      <Cell
                        key={`expense-cell-${entry.name}-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Income Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {incomePieData.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No income data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomePieData.map((entry, index) => (
                      <Cell
                        key={`income-cell-${entry.name}-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Spending Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Top Spending Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expensePieData
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)
              .map((category, index) => {
                const total = expensePieData.reduce((sum, c) => sum + c.value, 0);
                const percentage = (category.value / total) * 100;

                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        ${category.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      {percentage.toFixed(1)}% of total expenses
                    </p>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}