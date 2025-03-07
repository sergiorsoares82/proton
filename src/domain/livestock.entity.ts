type LivestockConstructorProps = {
  livestock_id?: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
};

type LivestockCreateCommand = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export class Livestock {
  livestock_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;

  constructor(props: LivestockConstructorProps) {
    this.livestock_id = props.livestock_id ?? "";
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: LivestockCreateCommand): Livestock {
    return new Livestock(props);
  }

  changeName(name: string): Livestock {
    return new Livestock({ ...this, name });
  }

  changeDescription(description: string | null): Livestock {
    return new Livestock({ ...this, description });
  }

  activate(): Livestock {
    return new Livestock({ ...this, is_active: true });
  }

  deactivate(): Livestock {
    return new Livestock({ ...this, is_active: false });
  }

  toJSON() {
    return {
      livestock_id: this.livestock_id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
