import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class MamaMoneyQuote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  customerFee: number;

  @Column()
  derivedExchangeRate: number;

  @Column()
  href: string;

  @Column()
  mamaFeeType: string;

  @Column()
  mamaFeeValue: number;

  @Column()
  payoutCurrency: string;

  @Column()
  payoutExchangeRate: number;

  @Column()
  receivableAmount: number;

  @Column()
  senderCurrency: string;

  @Column()
  settlementCurrency: string;

  @Column()
  settlementExchangeRate: number;


  @CreateDateColumn()
  created_at: Date;
}
