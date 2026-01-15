import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  name: string;
  email: string;
  phone: string;
  service: string;
  date?: string;
  message?: string;
  urgent?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, date, message, urgent }: BookingEmailRequest = await req.json();

    const urgentLabel = urgent ? "⚡ СРОЧНАЯ ЗАЯВКА ⚡" : "Новая заявка";
    
    const emailHtml = `
      <h1>${urgentLabel}</h1>
      <h2>Детали заявки:</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Имя:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Телефон:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
        </tr>
        ${email ? `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Услуга:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${service}</td>
        </tr>
        ${date ? `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Дата:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${date}</td>
        </tr>
        ` : ''}
        ${message ? `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Сообщение:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
        </tr>
        ` : ''}
      </table>
      <p style="margin-top: 20px; color: #666;">
        Отправлено с сайта HandyMan Swiss
      </p>
    `;

    const emailResponse = await resend.emails.send({
      from: "HandyMan Swiss <onboarding@resend.dev>",
      to: ["tiptopch@proton.me"],
      subject: `${urgent ? "⚡ СРОЧНО: " : ""}Новая заявка от ${name}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
