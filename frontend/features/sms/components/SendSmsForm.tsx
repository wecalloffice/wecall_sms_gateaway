"use client";
import { useForm } from "react-hook-form";
import { useSendSms } from "../hooks";
import { SmsPayload } from "../types";

export default function SendSmsForm() {
  const { register, handleSubmit, reset } = useForm<SmsPayload>();
  const sendMutation = useSendSms();

  const onSubmit = (data: SmsPayload) => {
    sendMutation.mutate(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded shadow">
      <input
        {...register("to")}
        placeholder="Recipient number(s)"
        className="input input-bordered w-full"
        required
      />
      <input
        {...register("senderId")}
        placeholder="Sender ID"
        className="input input-bordered w-full"
        required
      />
      <textarea
        {...register("message")}
        placeholder="Type your message"
        className="textarea textarea-bordered w-full"
        required
      />
      <button type="submit" className="btn btn-primary" disabled={sendMutation.isPending}>
        {sendMutation.isPending ? "Sending..." : "Send SMS"}
      </button>
      {sendMutation.isError && <p className="text-red-500">Failed to send SMS</p>}
      {sendMutation.isSuccess && <p className="text-green-500">Message sent!</p>}
    </form>
  );
}
