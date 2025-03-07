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

  update(props: Partial<LivestockConstructorProps>): Livestock {
    return new Livestock({ ...this, ...props });
  }
}
