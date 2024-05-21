import Course from "@/database/course.modal";
import Purchase from "@/database/purchase.modal";
import StripeCustomer from "@/database/stripecustomer.modal";
import { connectToDatabase } from "@/lib/mongoose";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    connectToDatabase();
    const course = await Course.findOne({
      _id: params.courseId,
      isPublished: true,
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const purchase = await Purchase.findOne({
      userId: user.id,
      courseId: params.courseId,
    });

    if (purchase) {
      return new NextResponse("Already Purchased", { status: 400 });
    }

    // Define line items for Stripe checkout page.
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
          },
          unit_amount: Math.round(course.price * 100),
        },
        quantity: 1,
      },
    ];

    let stripeCustomer = await StripeCustomer.findOne({
      userId: user.id,
    }).select("stripeCustomerId");

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses?.[0]?.emailAddress,
      });

      stripeCustomer = new StripeCustomer({
        userId: user.id,
        stripeCustomerId: customer.id,
      });

      await stripeCustomer.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer?.stripeCustomerId,
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course._id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course._id}?canceled=1`,
      metadata: {
        courseId: course._id.toString(),
        userId: user.id,
        price: course.price,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("COURSE_ID_CHECKOUT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
