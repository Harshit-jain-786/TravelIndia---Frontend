import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function ForgotPassword() {
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleRequest = async () => {
        const res = await fetch("http://localhost:8000/api/users/forgot-password-request/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
            toast({ title: "OTP Sent", description: data.message });
            setStep(2);
        } else {
            toast({ title: "Error", description: data.error, variant: "destructive" });
        }
    };

    const handleVerify = async () => {
        const res = await fetch("http://localhost:8000/api/users/forgot-password-verify/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp, new_password: newPassword }),
        });
        const data = await res.json();
        if (res.ok) {
            toast({ title: "Password Reset", description: data.message });
            setStep(1);
            setEmail(""); setOtp(""); setNewPassword("");
        } else {
            toast({ title: "Error", description: data.error, variant: "destructive" });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
            {step === 1 ? (
                <>
                    <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="mb-4"
                    />
                    <Button onClick={handleRequest}>Send OTP</Button>
                </>
            ) : (
                <>
                    <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                    <Input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        className="mb-4"
                    />
                    <div className="relative mb-4">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2 h-5 w-5 text-muted-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                    <Button onClick={handleVerify}>Reset Password</Button>
                </>
            )}
        </div>
    );
}
