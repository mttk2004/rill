# useToastRouter Hook

Custom React hook to wrap Inertia.js router with consistent toast notifications.

## Purpose

Provides a standardized way to show loading, success, and error toasts for Inertia router requests across the application.

## Features

- ✅ Automatic toast notifications for all states (pending, success, error)
- ✅ Promise-based API compatible with toast.promise
- ✅ TypeScript support with proper typing
- ✅ Preserves all Inertia router options
- ✅ Consistent error message extraction
- ✅ Supports POST, PUT, PATCH, DELETE methods

## Usage

### Basic Usage

```typescript
import { useToastRouter } from '@/hooks/use-toast-router';

function MyComponent() {
  const { post } = useToastRouter();

  const handleSubmit = (data) => {
    post('/orders', data, {
      success: 'Order created successfully!'
    });
  };
}
```

### With All Options

```typescript
const { post } = useToastRouter();

post('/orders', formData, {
  pending: 'Creating order...', // Optional
  success: 'Order created!',
  error: 'Failed to create order' // Optional, can also be a function
}, {
  preserveScroll: true,
  preserveState: true
});
```

### Custom Error Handler

```typescript
const { post } = useToastRouter();

post('/orders', data, {
  success: 'Success!',
  error: (err) => {
    // Custom error handling
    if (err.code === 'VALIDATION_ERROR') {
      return 'Please check your input';
    }
    return err.message || 'Unknown error';
  }
});
```

### DELETE Request

```typescript
const { delete: destroy } = useToastRouter();

const handleDelete = (id) => {
  if (confirm('Are you sure?')) {
    destroy(`/products/${id}`, {
      success: 'Product deleted!',
      error: 'Failed to delete product'
    });
  }
};
```

## Migration Guide

### Before (Old Pattern)

```typescript
router.post('/orders', data, {
  preserveScroll: true,
  onSuccess: () => {
    toast.success('Order created!');
  },
  onError: (errors) => {
    const errorMessage = Object.values(errors)[0];
    toast.error(errorMessage || 'Error occurred');
  }
});
```

### After (New Pattern)

```typescript
const { post } = useToastRouter();

post('/orders', data, {
  success: 'Order created!',
  error: 'Error occurred'
}, {
  preserveScroll: true
});
```

## Benefits

1. **Less Code**: ~10 lines reduced per request
2. **Consistency**: Same toast behavior everywhere
3. **Error Handling**: Automatic error message extraction
4. **Type Safety**: Full TypeScript support
5. **Maintainability**: Single source of truth for toast logic

## API Reference

### Methods

#### `post(url, data, messages, options?)`
#### `put(url, data, messages, options?)`
#### `patch(url, data, messages, options?)`
#### `delete(url, messages, options?)`

### Parameters

- `url`: string - The request URL
- `data`: Record<string, unknown> - Request payload (not needed for DELETE)
- `messages`: ToastMessages object
  - `pending?`: string - Loading message
  - `success`: string - Success message (required)
  - `error?`: string | function - Error message or handler
- `options?`: RouterOptions - Inertia router options
  - `preserveScroll?`: boolean
  - `preserveState?`: boolean
  - `only?`: string[]
  - `onSuccess?`: callback
  - `onError?`: callback

## Files to Update

Priority files using old pattern:
- `pages/cart.tsx` (2 usages)
- `pages/checkout.tsx` (1 usage)
- `pages/orders.tsx` (1 usage)
- `pages/admin/products/index.tsx` (2 usages)
- `pages/admin/orders/edit.tsx` (1 usage)
- `pages/addresses/index.tsx` (2 usages)

Total: ~15+ locations across 7+ files
