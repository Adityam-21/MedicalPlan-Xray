import { useRef } from "react";
import { useForm } from "react-hook-form";

import { predictMedicalPlan } from "../../services/api";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { formatINR } from "../../utils/format";
import {
    OCCUPATION_HELP,
    OCCUPATION_OPTIONS,
    PRESETS,
    SMOKER_OPTIONS,
    STATE_TIER_HELP,
    STATE_TIER_OPTIONS,
    TRAINING_RANGES,
} from "../../utils/formOptions";

const EMPTY = {
    age: "",
    state_tier: "",
    occupation_class: "",
    total_income_inr: "",
    annual_expenditure_inr: "",
    is_smoker: "",
    family_members: "",
};

// Mirrors backend/app/features.py SALARY_BRACKETS (display only).
function bracketLabel(income) {
    if (!Number.isFinite(income) || income <= 0) return "";
    if (income < 500000) return "Tier-1 (below ₹5L a year)";
    if (income < 1200000) return "Tier-2 (₹5L–₹12L a year)";
    if (income < 2500000) return "Tier-3 (₹12L–₹25L a year)";
    return "Tier-4 (₹25L a year and above)";
}

function outOfRangeNote(field, value) {
    const range = TRAINING_RANGES[field];
    if (!range || !Number.isFinite(value)) return "";
    const [low, high] = range;
    if (value < low || value > high) {
        const shown = field.endsWith("_inr")
            ? `${formatINR(low)}–${formatINR(high)}`
            : `${low}–${high}`;
        return `Outside the range the model was trained on (${shown}); the result will be less reliable.`;
    }
    return "";
}

const positiveNumber = (label) => ({
    required: `${label} is required`,
    valueAsNumber: true,
    validate: (v) =>
        (Number.isFinite(v) && v > 0) || `${label} must be a number greater than 0`,
});

function PredictionForm({ onStart, onResult, onError }) {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: EMPTY, mode: "onBlur" });

    const lastPayload = useRef(null);
    const income = watch("total_income_inr");
    const spending = watch("annual_expenditure_inr");
    const age = watch("age");
    const familyMembers = watch("family_members");

    const send = async (data) => {
        lastPayload.current = data;
        onStart();
        try {
            onResult(await predictMedicalPlan(data));
        } catch (error) {
            const detail =
                error?.response?.data?.detail ??
                (error?.response
                    ? `Server responded with ${error.response.status}.`
                    : "Could not reach the API. Is the backend running?");
            onError(String(detail));
        }
    };

    const applyPreset = (preset) => {
        reset(preset.values);
        send(preset.values);
    };

    return (
        <section className="rounded-xl border border-slate-200 bg-white">
            <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 px-5 py-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-slate-500">
                    Profile details
                </h2>
                <span className="text-[11px] text-slate-400">All fields required</span>
            </header>

            <div className="px-5 pt-4">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase tracking-wide text-slate-400">Examples</span>
                {PRESETS.map((preset) => (
                    <button
                        key={preset.name}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                    >
                        {preset.name}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit(send)} autoComplete="off" className="mt-5 space-y-5 pb-5" noValidate>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Input
                        id="age"
                        label="Age"
                        type="number"
                        inputMode="numeric"
                        min={18}
                        max={100}
                        placeholder="e.g. 45"
                        helperText={outOfRangeNote("age", age) || "Years, 18 or above"}
                        error={errors.age?.message}
                        {...register("age", {
                            required: "Age is required",
                            valueAsNumber: true,
                            min: { value: 18, message: "Minimum age is 18" },
                            max: { value: 100, message: "Maximum age is 100" },
                            validate: (v) => Number.isInteger(v) || "Enter a whole number",
                        })}
                    />

                    <Input
                        id="family_members"
                        label="Family members"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={20}
                        placeholder="e.g. 4"
                        helperText={
                            outOfRangeNote("family_members", familyMembers) ||
                            "People covered by the household budget, including you"
                        }
                        error={errors.family_members?.message}
                        {...register("family_members", {
                            required: "Family size is required",
                            valueAsNumber: true,
                            min: { value: 1, message: "Minimum is 1" },
                            max: { value: 20, message: "Maximum is 20" },
                            validate: (v) => Number.isInteger(v) || "Enter a whole number",
                        })}
                    />

                    <Select
                        id="state_tier"
                        label="State tier"
                        placeholder="Select state tier"
                        options={STATE_TIER_OPTIONS}
                        helperText={STATE_TIER_HELP}
                        error={errors.state_tier?.message}
                        {...register("state_tier", { required: "State tier is required" })}
                    />

                    <Select
                        id="occupation_class"
                        label="Occupation risk"
                        placeholder="Select occupation risk"
                        options={OCCUPATION_OPTIONS}
                        helperText={OCCUPATION_HELP}
                        error={errors.occupation_class?.message}
                        {...register("occupation_class", { required: "Occupation risk is required" })}
                    />

                    <Input
                        id="total_income_inr"
                        label="Annual household income (₹)"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        step={1000}
                        placeholder="e.g. 700000"
                        helperText={
                            outOfRangeNote("total_income_inr", income) ||
                            (Number.isFinite(income) && income > 0
                                ? `${formatINR(income)} · income bracket ${bracketLabel(income)}`
                                : "Total income before tax, for the whole household")
                        }
                        error={errors.total_income_inr?.message}
                        {...register("total_income_inr", positiveNumber("Income"))}
                    />

                    <Input
                        id="annual_expenditure_inr"
                        label="Annual household spending (₹)"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={1000}
                        placeholder="e.g. 135000"
                        helperText={
                            outOfRangeNote("annual_expenditure_inr", spending) ||
                            (Number.isFinite(spending) && spending >= 0
                                ? `${formatINR(spending)} · this is what drives the prediction`
                                : "Everything the household spends in a year, not only medical costs")
                        }
                        error={errors.annual_expenditure_inr?.message}
                        {...register("annual_expenditure_inr", {
                            required: "Annual spending is required",
                            valueAsNumber: true,
                            validate: (v) =>
                                (Number.isFinite(v) && v >= 0) || "Spending cannot be negative",
                        })}
                    />

                    <Select
                        id="is_smoker"
                        label="Smoker"
                        placeholder="Select option"
                        options={SMOKER_OPTIONS}
                        error={errors.is_smoker?.message}
                        {...register("is_smoker", {
                            required: "Please select an option",
                            setValueAs: (value) => (value === "" ? "" : Number(value)),
                        })}
                    />
                </div>

                <Button type="submit" fullWidth isLoading={isSubmitting}>
                    Predict plan
                </Button>

                <p className="text-[11px] leading-relaxed text-slate-500">
                    Inputs are sent to the prediction API and stored in a prediction log. Do not enter anything
                    you would not want recorded.
                </p>
            </form>
            </div>
        </section>
    );
}

export default PredictionForm;
