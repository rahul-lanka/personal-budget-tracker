from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from django.utils import timezone
from datetime import date, datetime
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['type', 'category__id', 'date', 'amount']
    search_fields = ['note']
    ordering_fields = ['date', 'amount']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).select_related('category')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Returns total income, total expenses and balance for current month or optionally from/to dates.
        Query params: start=YYYY-MM-DD, end=YYYY-MM-DD
        """
        start = request.query_params.get('start')
        end = request.query_params.get('end')
        qs = self.get_queryset()
        if start:
            qs = qs.filter(date__gte=start)
        if end:
            qs = qs.filter(date__lte=end)

        income = qs.filter(type=Transaction.INCOME).aggregate(total=Sum('amount'))['total'] or 0
        expenses = qs.filter(type=Transaction.EXPENSE).aggregate(total=Sum('amount'))['total'] or 0
        balance = income - expenses
        return Response({'income': income, 'expenses': expenses, 'balance': balance})

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def compare_month(self, request):
        """
        Compare budget vs actual expenses for a given month.
        Query param: month=YYYY-MM (defaults to current month)
        """
        month_text = request.query_params.get('month')
        if month_text:
            month_date = datetime.strptime(month_text + "-01", "%Y-%m-%d").date()
        else:
            today = timezone.localdate()
            month_date = date(today.year, today.month, 1)

        try:
            budget = Budget.objects.get(user=request.user, month=month_date)
            budget_amount = budget.amount
        except Budget.DoesNotExist:
            budget_amount = 0

        from django.db.models.functions import TruncMonth
        start_date = month_date
        # last day calculation: simple approach - next month minus one day
        import calendar
        last_day = calendar.monthrange(month_date.year, month_date.month)[1]
        end_date = date(month_date.year, month_date.month, last_day)

        expenses = Transaction.objects.filter(user=request.user, type=Transaction.EXPENSE, date__range=(start_date, end_date)).aggregate(total=Sum('amount'))['total'] or 0

        return Response({
            'month': month_date,
            'budget': budget_amount,
            'actual_expenses': expenses,
            'remaining': float(budget_amount) - float(expenses)
        })
