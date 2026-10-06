import { useEffect, useRef, useState } from "react";

/**
 * Observa quando um elemento entra na viewport (pra animações de scroll-reveal) sem
 * nenhuma lib externa — só IntersectionObserver. Quem tem prefers-reduced-motion ativado
 * já começa com visivel=true (decidido no valor inicial do estado, não dentro do efeito),
 * então nunca fica esperando uma animação que não vai rodar.
 *
 * `iniciarVisivel` desliga o observer de vez: use pra conteúdo que já está na tela quando
 * a página carrega. Animar a entrada de algo que o usuário já deveria estar lendo não
 * ganha nada e arrisca deixar a dobra em branco se o JS demorar.
 */
export function useRevelarAoEntrar<T extends HTMLElement>(iniciarVisivel = false) {
  const ref = useRef<T | null>(null);
  const [visivel, setVisivel] = useState(
    () => iniciarVisivel || window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (visivel) return;
    const elemento = ref.current;
    if (!elemento) return;

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) {
          setVisivel(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, [visivel]);

  return { ref, visivel };
}
