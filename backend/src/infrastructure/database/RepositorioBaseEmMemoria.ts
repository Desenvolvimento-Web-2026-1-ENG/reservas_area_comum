export abstract class RepositorioBaseEmMemoria<T extends { id: string }> {
  protected readonly itens = new Map<string, T>();

  async buscarPorId(id: string): Promise<T | null> {
    return this.itens.get(id) ?? null;
  }

  async salvar(item: T): Promise<void> {
    this.itens.set(item.id, item);
  }

  async remover(id: string): Promise<void> {
    this.itens.delete(id);
  }
}
