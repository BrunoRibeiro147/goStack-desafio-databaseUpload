import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransictionRepository from '../repositories/TransactionsRepository';
import CategoryRepository from '../repositories/CategoryRepository';

interface RequestProps {
  title: string;

  type: 'income' | 'outcome';

  value: number;

  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestProps): Promise<Transaction> {
    const transictionRepository = getCustomRepository(TransictionRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);

    if (type === 'outcome') {
      const balance = await transictionRepository.getBalance();

      if (value > balance.total) {
        throw new AppError(
          "You don't have balance to make this transaction",
          400,
        );
      }
    }

    const categorySearched = await categoryRepository.findByNameOrCreate(
      category,
    );

    const transaction = transictionRepository.create({
      title,
      value,
      type,
      category_id: categorySearched.id,
    });

    await transictionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
