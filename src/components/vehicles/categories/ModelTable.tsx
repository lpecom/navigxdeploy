import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ModelActions } from "./ModelActions";
import type { CarModel } from "@/types/vehicles";

interface ModelTableProps {
  models: CarModel[];
  onEdit: (model: CarModel) => void;
  onImageEdit: (model: CarModel) => void;
}

export const ModelTable = ({ models, onEdit, onImageEdit }: ModelTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Ano</TableHead>
          <TableHead>Imagem</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {models.map((model) => (
          <TableRow key={model.id}>
            <TableCell>{model.name}</TableCell>
            <TableCell>{model.year}</TableCell>
            <TableCell>
              {model.image_url ? (
                <img 
                  src={model.image_url} 
                  alt={model.name} 
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <span className="text-gray-400">Sem imagem</span>
              )}
            </TableCell>
            <TableCell>
              <ModelActions
                model={model}
                onEdit={onEdit}
                onImageEdit={onImageEdit}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};