import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getCustomRepository(CategoriesRepository);
    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome') {
      if (total < value) {
        throw new AppError('Saldo insuficiente');
      }
    }

    let findedCategory = await categoryRepository.findByTitle(category);

    if (!findedCategory) {
      findedCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(findedCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: findedCategory.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
