import { useState } from 'react'
import PageContainer from '../components/layout/PageContainer.jsx'
import Alert from '../components/common/Alert.jsx'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Input from '../components/common/Input.jsx'
import NumberInput from '../components/common/NumberInput.jsx'
import RadioGroup from '../components/common/RadioGroup.jsx'
import Select from '../components/common/Select.jsx'
import Spinner from '../components/common/Spinner.jsx'
import Toast from '../components/common/Toast.jsx'
import useToast from '../hooks/useToast.js'

const OCCUPATION_OPTIONS = [
  { value: 'Low-Risk', label: 'Low-Risk' },
  { value: 'Medium-Risk', label: 'Medium-Risk' },
  { value: 'High-Risk', label: 'High-Risk' },
]

const SMOKER_OPTIONS = [
  { value: 0, label: 'No' },
  { value: 1, label: 'Yes' },
]

/**
 * TEMPORARY diagnostic page — not part of the real application.
 * Renders every reusable component from src/components/common exactly
 * once, with realistic sample props, purely to verify each one renders
 * correctly in isolation. Safe to delete along with its /components
 * route once the real pages are built out.
 */
function ComponentDemo() {
  const [name, setName] = useState('')
  const [age, setAge] = useState(30)
  const [occupation, setOccupation] = useState('')
  const [isSmoker, setIsSmoker] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toasts, showToast, dismissToast } = useToast()

  return (
    <div className="bg-white py-12 sm:py-16">
      <PageContainer size="lg" className="space-y-12">
        <div>
          <h1 className="font-display text-3xl font-semibold text-gray-900">
            Component demo
          </h1>
          <p className="mt-2 text-gray-500">
            Temporary page — verifies every common/ component renders correctly.
          </p>
        </div>

        {/* Alert */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-gray-900">Alert</h2>
          <Alert variant="success" title="Prediction saved">
            Your recommendation was generated successfully.
          </Alert>
          <Alert variant="error" title="Something went wrong">
            We couldn&apos;t reach the server. Please try again.
          </Alert>
          <Alert variant="info">Model version 1.2.0 is currently in use.</Alert>
        </section>

        {/* Badge */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-gray-900">Badge</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Low</Badge>
            <Badge variant="warning">Medium</Badge>
            <Badge variant="danger">High</Badge>
          </div>
        </section>

        {/* Button */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-gray-900">Button</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" isLoading={isSubmitting} onClick={() => setIsSubmitting((v) => !v)}>
              {isSubmitting ? 'Loading' : 'Toggle loading'}
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </section>

        {/* Card */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-gray-900">Card</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card variant="default">
              <p className="font-medium text-gray-900">Default</p>
              <p className="mt-1 text-sm text-gray-500">Standard surface with border and shadow.</p>
            </Card>
            <Card variant="glass">
              <p className="font-medium text-gray-900">Glass</p>
              <p className="mt-1 text-sm text-gray-500">Translucent, blurred background.</p>
            </Card>
            <Card variant="feature">
              <p className="font-medium text-gray-900">Feature</p>
              <p className="mt-1 text-sm text-gray-500">Lighter resting state, hover lift.</p>
            </Card>
          </div>
        </section>

        {/* Input / NumberInput / RadioGroup / Select */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-gray-900">Form fields</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Full name"
              name="name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="Any native input prop passes through via ...rest."
            />
            <Input
              label="Email (with error)"
              name="email"
              placeholder="jane@example.com"
              error="Please enter a valid email address."
            />
            <NumberInput
              label="Age"
              name="age"
              min={18}
              max={100}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              helperText="Matches PredictionRequest.age (18-100)."
            />
            <Select
              label="Occupation class"
              name="occupation_class"
              placeholder="Select an option"
              options={OCCUPATION_OPTIONS}
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
            <RadioGroup
              label="Smoker"
              name="is_smoker"
              options={SMOKER_OPTIONS}
              value={isSmoker}
              onChange={(e) => setIsSmoker(Number(e.target.value))}
            />
          </div>
        </section>

        {/* Spinner */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-gray-900">Spinner</h2>
          <div className="flex items-center gap-6 text-primary-600">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </section>

        {/* Toast */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-gray-900">Toast</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => showToast({ variant: 'success', message: 'Prediction saved successfully.' })}
            >
              Show success toast
            </Button>
            <Button
              variant="outline"
              onClick={() => showToast({ variant: 'error', message: 'Something went wrong.' })}
            >
              Show error toast
            </Button>
          </div>
        </section>
      </PageContainer>

      {/* Toast viewport */}
      <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            message={toast.message}
            onClose={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default ComponentDemo
