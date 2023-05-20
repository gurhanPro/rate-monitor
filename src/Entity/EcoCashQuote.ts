import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class EcoCashQuote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  receive: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountToPay: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sendingAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  recipientAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  rate: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  reverseRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fees: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  vat: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sendingMinLimit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sendingMaxLimit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  receivingMinLimit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  receivingMaxLimit: number;

  @CreateDateColumn()
  created_at: Date;
}
