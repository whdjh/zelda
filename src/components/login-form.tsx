"use client";

import { useActionState } from "react";
import { ActionButton, TextField } from "@seed-design/react";
import { sendLoginLink } from "@/app/auth/actions";

export function LoginForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(sendLoginLink, { message: "", sent: false });
  return (
    <form action={action} className="flex flex-col gap-x4">
      <label id="login-email-label" htmlFor="email" className="t3-bold">이메일</label>
      <TextField.Root>
        <TextField.Input id="email" name="email" type="email" aria-labelledby="login-email-label" autoComplete="email" required maxLength={254} disabled={!enabled || pending} placeholder="you@example.com" />
      </TextField.Root>
      <ActionButton variant="neutralSolid" type="submit" disabled={!enabled || pending}>
        {pending ? "링크 요청 중…" : "이메일로 로그인 링크 받기"}
      </ActionButton>
      <p role="status" className="t3-regular">{state.message}</p>
    </form>
  );
}
