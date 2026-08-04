# Integración Oficina AFF

El exterior usa `AffOfficeExterior`, con origen `(0.5, 1)`, profundidad de estructura ferroviaria y una puerta calculada por offsets locales. La interacción conserva el id tutorial `affBoard` y abre `AffOfficeScene` sin avanzar el tutorial.

En el interior, sólo el diálogo del empleado confirma el permiso: la transición `affBoard` se aplica al cerrar la última página. La salida devuelve a `WorldScene` mediante datos discriminados, sin repetir la presentación de Retiro ni abrir diálogos.

La escena interior no permite guardar con G; el guardado corresponde al exterior.
