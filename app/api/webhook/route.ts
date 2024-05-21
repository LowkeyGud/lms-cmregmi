// This file handles webhook events from Stripe. It verifies the signature
// of each request to ensure that the request is coming from Stripe. It also
// handles the checkout.session.completed event type by creating a new purchase record in the database.
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import Purchase from "@/database/purchase.modal";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    // const logging: Logging = {
    //   url: req.url,
    //   method: req.method,
    //   body: body,
    //   statusCode: 400,
    //   errorMessage: error.message,
    //   createdAt: new Date(),
    // };

    // await createLogging(logging);

    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;
  const price = session?.metadata?.price;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      //   const logging: Logging = {
      //     url: req.url,
      //     method: req.method,
      //     body: body,
      //     statusCode: 400,
      //     errorMessage: "Missing metadata",
      //     createdAt: new Date(),
      //   };

      //   await createLogging(logging);

      return new NextResponse(`Webhook Error: Missing metadata`, {
        status: 400,
      });
    }

    await Purchase.create({
      courseId,
      userId,
      price,
    });
  } else {
    // const logging: Logging = {
    //   url: req.url,
    //   method: req.method,
    //   body: body,
    //   statusCode: 200,
    //   createdAt: new Date(),
    // };

    // await createLogging(logging);

    return new NextResponse(
      `Webhook Error: Unhandled event type ${event.type}`,
      { status: 200 }
    );
  }

  //   const logging: Logging = {
  //     url: req.url,
  //     method: req.method,
  //     body: body,
  //     statusCode: 200,
  //     createdAt: new Date(),
  //   };

  //   await createLogging(logging);

  return new NextResponse(null, { status: 200 });
}
