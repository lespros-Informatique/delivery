// Export de tous les formulaires
export { ProductForm } from './product-form';
export { CategoryForm } from './category-form';
export { PromotionForm } from './promotion-form';
export { VilleForm } from './ville-form';
export { ZoneLivraisonForm } from './zone-livraison-form';
export { RestaurantForm } from './restaurant-form';
export { UserForm } from './user-form';
export { LivreurForm } from './livreur-form';
export { FamilleForm } from './famille-form';
export { RoleForm } from './role-form';

// Types pour les formulaires
export interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}