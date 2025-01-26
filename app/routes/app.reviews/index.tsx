import { useEffect, useState, useRef } from "react";
import style from "../../styles/reviews.module.css";

interface Widget {
  id: string;
  shopifyBlockID: string;
  name: string;
  type: string;
  position: string;
  imageUrl: string;
  showDescription: string;
}

export default function ReviewsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [shopUrl, setShopUrl] = useState("");
  const [themes, setThemes] = useState<Record<string, boolean>>({});
  const isFetchingWidgets = useRef(false); // Evitar múltiples llamadas

  const fetchWidgets = async () => {
    if (isFetchingWidgets.current) return; // No repetir la petición
    isFetchingWidgets.current = true;

    const endpoint =
      "https://1836-2806-2f0-63a0-374a-2887-209e-9937-8f1a.ngrok-free.app/api/Widget/GetAll";

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener los widgets: ${response.status}`);
      }

      const data: Widget[] = await response.json();
      setWidgets((prev) => {
        // Evita re-renders si los datos son iguales
        const isSame = JSON.stringify(prev) === JSON.stringify(data);
        return isSame ? prev : data;
      });
    } catch (error) {
      console.error("Error al hacer el fetch:", error);
    } finally {
      isFetchingWidgets.current = false;
    }
  };

  const fetchActiveTheme = async (blockName: string) => {
    const endpoint =
      "https://1836-2806-2f0-63a0-374a-2887-209e-9937-8f1a.ngrok-free.app/api/Theme/ActiveTheme";
    const accessToken = "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";

    try {
      const shopName = shopify.config.shop || "default-shop";
      setShopUrl(shopName);
      const url = new URL(endpoint);
      url.searchParams.append("shop", shopName);
      url.searchParams.append("accessToken", accessToken);
      url.searchParams.append("blockName", blockName);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener el tema activo: ${response.status}`);
      }

      const data = await response.json();
      return data.active !== undefined ? data.active : false;
    } catch (error) {
      console.error("Error al hacer el fetch:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchWidgets(); // Solo se ejecuta una vez
  }, []);

  useEffect(() => {
    const checkThemes = async () => {
      const themeStatuses: Record<string, boolean> = {};
      await Promise.all(
        widgets.map(async (widget) => {
          const isActive = await fetchActiveTheme(widget.type);
          themeStatuses[widget.id] = isActive;
        })
      );
      setThemes(themeStatuses);
    };

    if (widgets.length > 0) {
      checkThemes();
    }
  }, [widgets]);

  return (
    <div className={style.container}>
      <header className={style.header}>
        <h1 className={style.headerTitle}>Widgets de Reseñas</h1>
        <p className={style.headerText}>
        Los widgets en Shopify son componentes personalizables que puedes integrar fácilmente en tu tienda para añadir funcionalidades específicas, 
        como mostrar reseñas, crear ventanas emergentes o mejorar la experiencia del cliente, sin necesidad de modificar el código de tu plantilla.
        </p>
      </header>

      <div className={style.row} id="widgets">
        {widgets.map((widget) => (
          <div className={style.col} key={widget.id}>
            <div className={style.card}>
              <img
                className={style.cardImage}
                src={widget.imageUrl}
                alt={widget.name}
              />
              <div className={style.cardBody}>
                <h5 className={style.cardTitle}>{widget.name}</h5>
                <p className={style.cardText}>{widget.showDescription}</p>
                <div className={style.btnContainer}>
                  <button className={style.btnCustomize}>Customize</button>
                  {themes[widget.id] ? (
                    <button className={style.btnActive}>Active</button>
                  ) : (
                    <a
                      href={`https://${shopUrl}/admin/themes/current/editor?template=product&addAppBlockId=${widget.shopifyBlockID}/${widget.type}&target=${widget.position}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={style.btnAdd}
                    >
                      Add widget
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
