// Definindo o tipo de propriedades para o construtor da categoria
export type CategoryConstructorProps = {
  category_id?: string; // O ID da categoria (opcional, caso já exista)
  name: string; // Nome da categoria (obrigatório)
  description?: string | null; // Descrição da categoria (opcional, pode ser null)
  is_active?: boolean; // Se a categoria está ativa ou não (opcional, padrão é true)
  created_at?: Date; // Data de criação da categoria (opcional, padrão é a data atual)
};

// Definindo o tipo de comando para criar uma nova categoria
export type CategoryCreateCommand = {
  name: string; // Nome da categoria (obrigatório)
  description?: string | null; // Descrição da categoria (opcional, pode ser null)
  is_active?: boolean; // Se a categoria está ativa ou não (opcional, padrão é true)
};

// Classe que representa uma categoria no sistema
export class Category {
  category_id: string; // ID único da categoria
  name: string; // Nome da categoria
  description: string | null; // Descrição da categoria
  is_active: boolean; // Status de ativação da categoria
  created_at: Date; // Data de criação da categoria

  // Construtor que inicializa uma nova instância de categoria
  constructor(props: CategoryConstructorProps) {
    this.category_id = props.category_id ?? ""; // Se não houver category_id, um valor vazio será atribuído
    this.name = props.name; // Atribui o nome fornecido
    this.description = props.description ?? null; // Atribui a descrição fornecida, ou null se não houver
    this.is_active = props.is_active ?? true; // Se is_active não for fornecido, o valor padrão será true
    this.created_at = props.created_at ?? new Date(); // Se created_at não for fornecido, a data atual será usada
  }

  // Método estático para criar uma nova categoria
  static create(props: CategoryCreateCommand): Category {
    return new Category(props); // Retorna uma nova instância de Category com as propriedades fornecidas
  }

  // Método para atualizar uma categoria existente
  update(props: Partial<CategoryConstructorProps>): Category {
    return new Category({ ...this, ...props }); // Cria uma nova instância de categoria mesclando as propriedades atuais com as novas
  }
}
