/**
 * =========================================================================
 * NELLYKIT - API DE GOOGLE APPS SCRIPT PARA CATÁLOGO DINÁMICO
 * =========================================================================
 * Este script lee automáticamente todas las hojas de cálculo de tu archivo
 * ("Estuches de maquillaje", "Bolsos diarios", o cualquier pestaña que agregues a futuro)
 * y devuelve los productos en formato JSON optimizado para tu tienda web.
 */

function doGet(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();
    
    const categories = [];
    const products = [];

    sheets.forEach(sheet => {
      const sheetName = sheet.getName();
      // Omitir hojas ocultas o que empiecen con guión bajo
      if (sheetName.startsWith('_')) return;

      const slug = slugify(sheetName);
      categories.push({
        id: slug,
        name: sheetName,
      });

      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) return; // Vacía o solo encabezados

      const headers = data[0].map(h => String(h).trim().toLowerCase());
      
      // Mapear índices de columnas
      const colCodigo = findCol(headers, ['código', 'codigo', 'cod', 'id']);
      const colTitulo = findCol(headers, ['título', 'titulo', 'nombre', 'producto']);
      const colDesc = findCol(headers, ['descripción', 'descripcion', 'detalle']);
      const colStock = findCol(headers, ['stock', 'disponible']);
      const colPrecioUnidad = findCol(headers, ['precio por unidad', 'precio unidad', 'precio menor', 'precio']);
      const colP3 = findCol(headers, ['precio 3 unidades', '3 unidades', 'precio 3']);
      const colP10 = findCol(headers, ['precio 10 unidades', '10 unidades', 'precio 10']);
      const colP20 = findCol(headers, ['souvenir 20 unidades', '20 unidades', 'souvenir 20']);
      const colP30 = findCol(headers, ['souvenir 30 unidades', '30 unidades', 'souvenir 30']);
      const colP30Plus = findCol(headers, ['souvenir más de 30 unidades', 'souvenir mas de 30', 'más de 30', 'mas de 30']);

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const code = String(row[colCodigo] || '').trim();
        const title = String(row[colTitulo] || '').trim();

        // Si no tiene código ni título, saltar fila
        if (!code && !title) continue;

        const stockRaw = String(row[colStock] || 'Sí').trim().toLowerCase();
        const stock = stockRaw === 'sí' || stockRaw === 'si' || stockRaw === 'true' || stockRaw === '1';

        const priceRetail = parsePrice(row[colPrecioUnidad]);
        const p3 = parsePrice(row[colP3]);
        const p10 = parsePrice(row[colP10]);
        const p20 = parsePrice(row[colP20]);
        const p30 = parsePrice(row[colP30]);
        const p30PlusRaw = String(row[colP30Plus] || 'Cotizar').trim();

        products.push({
          code: code || `PROD-${i}`,
          categoryId: slug,
          categoryName: sheetName,
          title: title,
          description: String(row[colDesc] || '').trim(),
          stock: stock,
          priceRetail: priceRetail,
          wholesaleTiers: {
            tier3: { units: 3, total: p3, unitPrice: p3 ? Math.round(p3 / 3) : null, label: '3 unidades' },
            tier10: { units: 10, total: p10, unitPrice: p10 ? Math.round(p10 / 10) : null, label: '10 unidades' },
            souvenir20: { units: 20, total: p20, unitPrice: p20 ? Math.round(p20 / 20) : null, label: 'Souvenir 20 unidades' },
            souvenir30: { units: 30, total: p30, unitPrice: p30 ? Math.round(p30 / 30) : null, label: 'Souvenir 30 unidades' },
            souvenirPlus: { units: 'más de 30', total: p30PlusRaw || 'Cotizar', unitPrice: 'A convenir', label: 'Souvenir más de 30 unidades' },
          }
        });
      }
    });

    const responsePayload = {
      success: true,
      lastUpdated: new Date().toISOString(),
      categoriesCount: categories.length,
      productsCount: products.length,
      categories: categories,
      products: products
    };

    return ContentService.createTextOutput(JSON.stringify(responsePayload))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Helpers
function findCol(headers, candidates) {
  for (let c of candidates) {
    const idx = headers.indexOf(c);
    if (idx !== -1) return idx;
  }
  return -1;
}

function parsePrice(val) {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val;
  // Limpiar caracteres como $, puntos de miles, comas
  const clean = String(val).replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}
