import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const { affected } = await transactionRepository.delete({ id });
    console.log(id);
    console.log(affected);
    if (!affected) {
      throw new AppError('Transaction is missing.', 400);
    }
  }
}

export default DeleteTransactionService;
