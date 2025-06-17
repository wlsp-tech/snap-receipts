import { ChangeEvent, useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";
import { DocumentSelectorProps, OCRResult } from "@/types";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import {
    Button,
    Input,
    Label,
    LayoutContainer,
    Select,
    SelectContent, SelectItem,
    SelectTrigger,
    SelectValue,
    Skeleton
} from "@/components";

const categories = [
    { label: "Food / Essen", value: "food" },
    { label: "Transport / Transport", value: "transport" },
    { label: "Office / Büro", value: "office" },
];

export default function DocumentSelector({
     fileUri,
     setFileUri,
     onSelect,
     onCancel,
     readyToUploadFile,
     setReadyToUploadFile,
     handleUploadCallback,
     formValues,
     setFormValues,
 }: Readonly<DocumentSelectorProps>) {
    const [loading, setLoading] = useState(false);
    const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fieldErrors, setFieldErrors] = useState({
        company: "",
        date: "",
        amount: "",
        category:""
    });

    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uri = URL.createObjectURL(file);

        onSelect(uri, file.type);

        if (fileUri) URL.revokeObjectURL(fileUri);
        setFileUri(null);

        setTimeout(() => setFileUri(uri), 10);
        setReadyToUploadFile(false);
    };

    const handleCheckBeforeUpload = async () => {
        const errors = {
            company: formValues.company.trim() ? "" : "Company is required.",
            date: formValues.date.trim() ? "" : "Date is required.",
            amount: formValues.amount.trim() ? "" : "Amount is required.",
            category: formValues.category.trim() ? "" : "Category is required."
        };

        setFieldErrors(errors);

        const hasErrors = Object.values(errors).some((e) => e !== "");
        if (hasErrors) {
            toast.error("Please correct the highlighted fields.");
            return;
        }

        handleUploadCallback()
    };

    useEffect(() => {
        if (!fileUri) return;

        (async () => {
            setLoading(true);
            try {
                const { data } = await Tesseract.recognize(fileUri, "eng+deu");

                const text = data.text;
                const lines = text
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean)
                    .slice(0, 20);

                const dateMatch = /(?:\b(?:Datum|Date)\b\s*[:-]?\s*)?(\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b|\b\d{4}[./-]\d{1,2}[./-]\d{1,2}\b)/i.exec(text);
                const rawDate = dateMatch?.[1] ?? "";

                const amountMatch = /(total|gesamt|gesamtbetrag|summe|amount|betrag)\D{0,10}(\d+[.,]\d{2})/i.exec(text);

                const normalizedDate = rawDate
                    .replace(/[-/]/g, ".")
                    .replace(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/, (_, d, m, y) => {
                        const day = d.padStart(2, "0");
                        const month = m.padStart(2, "0");
                        const year = y.length === 2 ? "20" + y : y;
                        return `${day}.${month}.${year}`;
                    })
                    .replace(/(\d{4})\.(\d{1,2})\.(\d{1,2})/, (_, y, m, d) => {
                        const day = d.padStart(2, "0");
                        const month = m.padStart(2, "0");
                        return `${day}.${month}.${y}`;
                    });

                const result: OCRResult = {
                    date: normalizedDate || "",
                    amount: amountMatch?.[2] ?? "",
                    company:
                        lines.find(
                            (l) =>
                                !/\d/.test(l) &&
                                !/rechn|invoice|summe|datum|date/i.test(l) &&
                                l.length > 3
                        ) ?? "",
                    category:
                        lines.find((l) =>
                            /\b(essen|food|restaurant|lebensmittel|transport|fahrt|reise|verkehr|büro|office)/i.test(l)
                        )?.toLowerCase().includes("essen") || lines.find((l) => /food|restaurant|lebensmittel/i.test(l))
                            ? "food"
                            : lines.find((l) => /transport|fahrt|reise|verkehr/i.test(l))
                                ? "transport"
                                : lines.find((l) => /büro|office/i.test(l))
                                    ? "office"
                                    : "",
                };

                setOcrResult(result);
                setFormValues(result);
                setReadyToUploadFile(true);
            } catch (err) {
                toast.error(`OCR failed. ${err}`);
            } finally {
                setLoading(false);
            }
        })();
    }, [fileUri, setReadyToUploadFile, setFormValues]);

    const handleCancelInternal = () => {
        if (fileUri) URL.revokeObjectURL(fileUri);
        setOcrResult(null);
        setFormValues({ date: "", amount: "", company: "", category: "" });
        setReadyToUploadFile(false);
        setFileUri(null);
        onCancel?.();
    };

    return (
        <LayoutContainer className="flex flex-col items-center gap-4 w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
            />

            {!ocrResult && !loading && (
                <Button className="mt-6" onClick={triggerFileSelect} disabled={loading}>
                    Select a receipt
                </Button>
            )}

            <div className="flex-1 mx-auto mt-4 space-y-2">
                <Label htmlFor="company">Company</Label>
                {loading ? (
                    <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
                ) : (
                    <>
                        <Input
                            id="company"
                            value={formValues.company}
                            placeholder="Company"
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormValues((prev) => ({ ...prev, company: value }));
                                if (value.trim()) {
                                    setFieldErrors((prev) => ({ ...prev, company: "" }));
                                }
                            }}
                        />
                        {fieldErrors.company && (
                            <p className="text-sm text-red-500 mt-1">{fieldErrors.company}</p>
                        )}
                    </>
                )}

                <Label htmlFor="date">Date</Label>
                {loading ? (
                    <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
                ) : (
                    <>
                        <Input
                            id="date"
                            value={formValues.date}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormValues((prev) => ({ ...prev, date: value }));
                                if (value.trim()) {
                                    setFieldErrors((prev) => ({ ...prev, date: "" }));
                                }
                            }}
                            placeholder="DD.MM.YYYY"
                        />
                        {fieldErrors.date && (
                            <p className="text-sm text-red-500 mt-1">{fieldErrors.date}</p>
                        )}
                    </>
                )}

                <Label htmlFor="amount">Amount</Label>
                {loading ? (
                    <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
                ) : (
                    <>
                        <Input
                            id="amount"
                            value={formValues.amount}
                            placeholder="Total"
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormValues((prev) => ({ ...prev, amount: value }));
                                if (value.trim()) {
                                    setFieldErrors((prev) => ({ ...prev, amount: "" }));
                                }
                            }}
                        />
                        {fieldErrors.amount && (
                            <p className="text-sm text-red-500 mt-1">{fieldErrors.amount}</p>
                        )}
                    </>
                )}

                <Label htmlFor="category">Category</Label>
                {loading ? (
                    <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
                ) : (
                    <>
                        <Select
                            value={formValues.category}
                            onValueChange={(value) => {
                                setFormValues((prev) => ({ ...prev, category: value }));
                                if (value.trim()) {
                                    setFieldErrors((prev) => ({ ...prev, category: "" }));
                                }
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.value} value={c.value}>
                                        {c.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldErrors.category && (
                            <p className="text-sm text-red-500 mt-1">{fieldErrors.category}</p>
                        )}
                    </>
                )}

                <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={triggerFileSelect} disabled={loading || !fileUri || !readyToUploadFile}>
                        Choose another file
                    </Button>
                    <Button onClick={handleCheckBeforeUpload} disabled={!readyToUploadFile || loading || !fileUri}>
                        Upload
                    </Button>

                    <Button variant="destructive" onClick={handleCancelInternal} disabled={loading || !fileUri || !readyToUploadFile}>
                        <Trash2Icon className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </LayoutContainer>
    );
}
