# Trabajo Práctico 2 - Algoritmia 2024

Demo: https://final-algoritmia-game-of-life.vercel.app

## El Juego de la Vida

### Introducción

¿Cuáles son las leyes de la vida? ¿La complejidad de la vida a nuestro alrededor se debe a un gran conjunto de leyes sofisticadas o será que un número pequeño de leyes sencillas puede generar patrones de vida complejos?

En 1970, el matemático **John Horton Conway** creó un experimento llamado **El Juego de la Vida**, basado en tres reglas fundamentales: **nacimiento**, **muerte** y **supervivencia**.

El juego se desarrolla sobre una grilla cuadriculada donde cada cuadrado puede estar vacío o contener una célula. A partir de una posición inicial, el sistema evoluciona según las siguientes reglas:

1. Si un cuadrado vacío está rodeado por tres células vecinas, **se crea vida**, agregando una célula en ese lugar.
2. Si una célula tiene menos de dos células vecinas, **muere por aislamiento** y el cuadrado queda vacío. Si tiene más de tres células vecinas, **muere por sofocación**, liberando su espacio.
3. Una célula con **exactamente dos o tres células vecinas** sobrevive a la siguiente instancia del juego.

Sorprendentemente, con estas reglas simples, el juego genera patrones complejos que pueden ser estáticos, dinámicos o incluso interactuar entre sí.

---

## Consignas

1. **Diagramar un algoritmo** para simular el Juego de la Vida.
2. El trabajo es de **realización personal**. Cada alumno elige el lenguaje de programación a utilizar.
3. El juego será para un **solo jugador**, quien proporcionará la configuración inicial de la grilla.
4. Las generaciones del juego deberán **mostrarse en pantalla cada 2 segundos**.
5. La grilla tendrá un tamaño de:
   - **30 x 30** o
   - **55 x 55** (el jugador elige el tamaño al iniciar el juego).
6. El programa debe informar cuántas generaciones logró el jugador a partir de su configuración inicial.
7. **Investigar y sacar conclusiones** acerca del problema del Juego de la Vida.

## Referencia

Más información sobre el **Juego de la Vida de Conway**: [Wikipedia](https://es.wikipedia.org/wiki/Juego_de_la_vida).

## Recursos

- https://conwaylife.com/wiki/
- https://www.youtube.com/watch?v=Kk2MH9O4pXY
- https://www.youtube.com/watch?v=ouipbDkwHWA