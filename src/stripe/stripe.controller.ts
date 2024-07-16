import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { StripeService } from './stripe.service';
import {Role} from "../roles/roles.enum";

export const CAN_SKIP_AUTH_KEY = 'isPublic';
export const SkipAuthentication = () => SetMetadata(CAN_SKIP_AUTH_KEY, true);
type StripeAccountDto = {
  email: string;
  companyName: string;
  country: string;
};
type StripePriceDto = {
  currency: string;
  unit_amount: number;
  recurring: {
    interval: string;
    interval_count: number;
  };
};
type MembershipDTO = {
  name: string;
  description: string;
  default_price_data: StripePriceDto;
};

@ApiTags('Stripe link API')
@Controller('stripe')
@ApiBearerAuth('JWT-auth')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @Post('/subscriptions')
  @SkipAuthentication()
  async createSubscriptionIntent(
    @Body() params: { priceId: string; customerId: string; confirmationTokenId: string},
  ) {
    return this.stripeService.createSubscriptionIntent(params);
  }

  @Get('/invoices/:id')
  @Roles([Role.Admin, Role.SuperAdmin, Role.CurrentUser])
  async listInvoices(
    @Query('customerId') customerId: string,
  ) {
    return this.stripeService.getAllInvoices(customerId);
  }


  @Get('/subscriptions/:id')
  @Roles([Role.Admin, Role.SuperAdmin, Role.CurrentUser])
  async listSubscriptions(
      @Query('customerId') customerId: string,
  ) {
    return this.stripeService.getSubscription(customerId);
  }

  @Delete('/subscriptions/:id')
  @Roles([Role.Admin, Role.SuperAdmin, Role.CurrentUser])
  async cancelSubscription(
    @Param('id') userId: number,
    @Query('subscriptionId') subscriptionId: string,
  ) {
    return this.stripeService.cancelSubscription(
      subscriptionId,
      userId,
    );
  }
}
