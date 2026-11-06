import { useEffect, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";

import FormAlert from "../Form/FormAlert";
import { MinusIcon, PlusIcon } from "../Icons/Icons";
import { cropImage, PRODUCT_IMAGE_ASPECT } from "../../utils/image";

import "../DeleteProductDialog/DeleteProductDialog.css";
import "./PhotoCropDialog.css";

interface PhotoCropDialogProps {
    imageSrc: string;
    onCancel: () => void;
    onConfirm: (file: File) => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

export default function PhotoCropDialog({ imageSrc, onCancel, onConfirm }: PhotoCropDialogProps) {
    const confirmRef = useRef<HTMLButtonElement>(null);

    // crop = posição da foto dentro da moldura; zoom = quanto ela está ampliada.
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(MIN_ZOOM);

    // Área escolhida em pixels da foto original: é o que o canvas vai recortar.
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        confirmRef.current?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !isProcessing) {
                onCancel();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isProcessing, onCancel]);

    function changeZoom(value: number) {
        setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value)));
    }

    async function handleConfirm() {
        if (!croppedArea) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            onConfirm(await cropImage(imageSrc, croppedArea));
        } catch (cropError) {
            setError(
                cropError instanceof Error
                    ? cropError.message
                    : "Não foi possível recortar a foto. Tente outra imagem."
            );
            setIsProcessing(false);
        }
    }

    return (
        <div className="dialog-overlay" onClick={isProcessing ? undefined : onCancel}>
            <div
                className="dialog crop-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="crop-dialog-title"
                aria-describedby="crop-dialog-text"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 id="crop-dialog-title">Ajustar foto</h2>

                <p id="crop-dialog-text">
                    Arraste a foto para escolher o que aparece na vitrine e use o zoom para
                    aproximar. A moldura já está no formato dos cards da loja.
                </p>

                <div className="crop-area">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        minZoom={MIN_ZOOM}
                        maxZoom={MAX_ZOOM}
                        zoomSpeed={0.5}
                        aspect={PRODUCT_IMAGE_ASPECT}
                        onCropChange={setCrop}
                        onZoomChange={changeZoom}
                        onCropComplete={(_, areaPixels) => setCroppedArea(areaPixels)}
                    />
                </div>

                <div className="crop-zoom">
                    <button
                        type="button"
                        className="crop-zoom-button"
                        onClick={() => changeZoom(zoom - ZOOM_STEP * 3)}
                        disabled={zoom <= MIN_ZOOM || isProcessing}
                        aria-label="Diminuir zoom"
                    >
                        <MinusIcon size={16} />
                    </button>

                    <input
                        type="range"
                        min={MIN_ZOOM}
                        max={MAX_ZOOM}
                        step={ZOOM_STEP}
                        value={zoom}
                        onChange={(event) => changeZoom(Number(event.target.value))}
                        disabled={isProcessing}
                        aria-label="Zoom"
                    />

                    <button
                        type="button"
                        className="crop-zoom-button"
                        onClick={() => changeZoom(zoom + ZOOM_STEP * 3)}
                        disabled={zoom >= MAX_ZOOM || isProcessing}
                        aria-label="Aumentar zoom"
                    >
                        <PlusIcon size={16} />
                    </button>
                </div>

                {error && <FormAlert>{error}</FormAlert>}

                <div className="dialog-actions">
                    <button
                        type="button"
                        className="admin-button outline"
                        onClick={onCancel}
                        disabled={isProcessing}
                    >
                        Cancelar
                    </button>

                    <button
                        ref={confirmRef}
                        type="button"
                        className="admin-button primary"
                        onClick={handleConfirm}
                        disabled={!croppedArea || isProcessing}
                    >
                        {isProcessing ? "Preparando..." : "Usar foto"}
                    </button>
                </div>
            </div>
        </div>
    );
}
