import { EntityRepository, Repository } from 'typeorm';
import Category from '../models/Category';

@EntityRepository(Category)
class CategoryRepository extends Repository<Category> {
  public async findByNameOrCreate(searchCategory: string): Promise<Category> {
    const category = await this.findOne({ where: { title: searchCategory } });

    if (category) {
      return category;
    }

    const newCategory = this.create({
      title: searchCategory,
    });

    await this.save(newCategory);

    return newCategory;
  }
}

export default CategoryRepository;
