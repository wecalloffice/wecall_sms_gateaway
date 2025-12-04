// "use client";

// import React from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import LoginForm from "./LoginForm";

// export default function LoginPage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <Tabs defaultValue="login">
//         <TabsList>
//           <TabsTrigger value="login">Login</TabsTrigger>
//         </TabsList>

//         <TabsContent value="login">
//           <LoginForm />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return <LoginForm />;
}
