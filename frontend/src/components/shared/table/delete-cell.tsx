import { useState } from "react";
import { Button } from "@/components/ui/common/button.tsx";
import { Trash2Icon, Loader2 } from "lucide-react";
import {DeleteCellProps} from "@/types";

const DeleteCell = ({deleteCallback } : DeleteCellProps ) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteCallback()
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button  variant="icon" className="hover:text-destructive p-0" disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? (
                <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Deleting...
                </>
            ) : (
                    <Trash2Icon className="ml-1 w-4 h-4" />
            )}
        </Button>
    );
}

export default DeleteCell;