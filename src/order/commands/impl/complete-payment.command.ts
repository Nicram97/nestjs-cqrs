export class CompletePaymentCommand {
  constructor(
    public readonly orderTransactionGUID: string,
    public readonly orderUser: string,
    public readonly orderItem: string,
    public readonly orderAmount: number,
  ) {}
}
