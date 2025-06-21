import {createFileRoute} from '@tanstack/react-router';
import {HeroSvg, LayoutContainer} from "@/components";
import {useEffect} from 'react';
import gsap from 'gsap';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';

function Root() {
    gsap.registerPlugin(MotionPathPlugin);

    useEffect(() => {
        const paths = gsap.utils.toArray<SVGPathElement>(".svg-path");
        const colors = ['#6766cb', '#ab88e8', '#615fff', '#5d5d70', '#ffffff', '#615fff', '#615fff'];

        // Zufällige Reihenfolge der Punkte
        const shuffledIndices = gsap.utils.shuffle(Array.from(Array(paths.length).keys()));

        // Gruppen zu je 3 Punkten bilden
        const groups: number[][] = [];
        for (let i = 0; i < shuffledIndices.length; i += 3) {
            groups.push(shuffledIndices.slice(i, i + 3));
        }

        // Master Timeline für den Loop
        const masterTimeline = gsap.timeline({repeat: -1});

        groups.forEach(group => {
            const groupTimeline = gsap.timeline();

            group.forEach(index => {
                const path = paths[index];
                if (!path) return;

                const parent = path.parentNode as SVGElement;
                const circle = parent.querySelector(".circle-dot") as SVGCircleElement;
                const label = parent.querySelector(".label") as SVGTextElement;

                // SPEED: Animationsdauer (3 Sekunden)
                const animationDuration = 4.5;

                // Zufälliges Delay innerhalb der Gruppe
                const delay = gsap.utils.random(0.2, 0.6);

                // CIRCLE: Farbe für Punkt zuweisen
                const color = colors[index % colors.length];
                circle.setAttribute('fill', color);

                // GLOW: Nutze vorhandene Masken und Gradienten
                const maskId = `glow_mask_${index}`;
                const gradientId = `glow_gradient_${index}`;

                // Erstelle Masken-Element falls nicht vorhanden
                let maskCircle: SVGCircleElement | null = null;
                if (!document.querySelector(`#${maskId}`)) {
                    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    defs.innerHTML = `
                <mask id="${maskId}">
                    <path d="${path.getAttribute('d')}" fill="black"></path>
                    <circle class="glow-mask-circle" r="0" fill="white"></circle>
                </mask>
                <radialGradient id="${gradientId}" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-opacity="1" stop-color="${color}"></stop>
                    <stop offset="100%" stop-opacity="0" stop-color="${color}"></stop>
                </radialGradient>
            `;
                    document.querySelector('svg')?.appendChild(defs);
                }

                // Setze Masken und Gradienten
                path.setAttribute('mask', `url(#${maskId})`);
                path.setAttribute('stroke', `url(#${gradientId})`);

                // Referenz zum Masken-Kreis
                maskCircle = document.querySelector(`#${maskId} .glow-mask-circle`) as SVGCircleElement;

                // GLOW: Maximale Größe des Leuchteffekts
                const maxGlowRadius = 35;

                // Startzustand: unsichtbar
                gsap.set(circle, {
                    attr: {r: 0.001},
                    opacity: 0
                });
                gsap.set(maskCircle, {attr: {r: 0}});
                gsap.set(label, {opacity: 0});

                // PATH: Objekt für Fortschritt speichern (Start bei 1 = Ende des Pfads)
                const animationState = {progress: 1};

                // Gemeinsame Animation für Punkt, Label und Glow
                const motionTween = gsap.to(animationState, {
                    progress: 0, // RICHTUNG: Von 1 nach 0 = rückwärts entlang des Pfads
                    duration: animationDuration,
                    delay,
                    ease: "power1.inOut",
                    onUpdate: () => {
                        const progress = animationState.progress;
                        const pathLength = path.getTotalLength();

                        // PATH: Punktposition berechnen (rückwärts)
                        const point = path.getPointAtLength(progress * pathLength);

                        // Berechnung der Größen basierend auf Fortschritt
                        let circleRadius = 0;
                        let glowRadius = 0;
                        let opacity = 0;

                        // Erste 5%: Wachsen von 0 auf 3 (jetzt am ENDE des Pfads)
                        if (progress >= 0.95) {
                            const factor = (1 - progress) / 0.05;
                            circleRadius = 3 * factor;
                            glowRadius = maxGlowRadius * factor;
                            opacity = factor;
                        }
                        // Letzte 5%: Schrumpfen von 3 auf 0 (jetzt am ANFANG des Pfads)
                        else if (progress <= 0.05) {
                            const factor = progress / 0.05;
                            circleRadius = 3 * factor;
                            glowRadius = maxGlowRadius * factor;
                            opacity = factor;
                        }
                        // Mittlerer Bereich: Volle Größe
                        else {
                            circleRadius = 3;
                            glowRadius = maxGlowRadius;
                            opacity = 1;
                        }

                        // CIRCLE: Position und Eigenschaften setzen
                        gsap.set(circle, {
                            attr: {
                                cx: point.x,
                                cy: point.y,
                                r: circleRadius
                            },
                            opacity: opacity
                        });

                        if (label) {
                            gsap.set(label, {
                                attr: {
                                    x: point.x,
                                    y: point.y + 8
                                },
                                opacity: opacity
                            });
                        }

                        // GLOW: Maskenposition aktualisieren
                        if (maskCircle) {
                            gsap.set(maskCircle, {
                                attr: {
                                    cx: point.x,
                                    cy: point.y,
                                    r: glowRadius
                                }
                            });
                        }

                        // GLOW: Gradientenposition aktualisieren
                        const gradient = document.querySelector(`#${gradientId}`) as SVGRadialGradientElement;
                        if (gradient) {
                            gradient.setAttribute('cx', point.x.toString());
                            gradient.setAttribute('cy', point.y.toString());
                            gradient.setAttribute('r', glowRadius.toString());
                        }
                    },
                    onComplete: () => {
                        // Sicherstellen, dass Punkt am Anfang unsichtbar ist
                        gsap.set(circle, {
                            attr: {r: 0.001},
                            opacity: 0
                        });
                        gsap.set(label, {opacity: 0});
                        if (maskCircle) {
                            gsap.set(maskCircle, {attr: {r: 0}});
                        }
                    }
                });

                groupTimeline.add(motionTween, 0);
            });

            // Pause zwischen den Gruppen
            masterTimeline.add(groupTimeline, ">+0.5");
        });

        return () => {
            masterTimeline.kill();
        };
    }, []);

    return (
        <LayoutContainer className="p-4">
            <h1 className="landing max-w-xl mx-auto">Welcome to the Snap side of the <span className="text-indigo-500">Receipts!</span>
            </h1>
            <h3 className="max-w-xl mx-auto text-center text-[#a9a9a9]">Blazing fast receipt digitization, organizes and merges receipts – turning paper chaos into digital clarity in seconds.</h3>
            <div className="hero__diagram w-[760px] h-[580px] lg:h-[680px]" id="hero-diagram" data-v-5ae9923b="">
                <HeroSvg/>
                <div className="snap-receipt active absolute w-36 h-36 top-[60%] md:top-[52%] lg:top-[52%] left-84 md:left-[81%] lg:left-1/2 rounded-[10px] aspect-square transform" data-v-5ae9923b="">
                    <div className="snap-receipt__background" data-v-5ae9923b="">
                        <div className="snap-receipt__border" data-v-5ae9923b=""></div>
                        <div className="snap-receipt__edge edge--animated" data-v-5ae9923b=""></div>
                    </div>
                    <div className="snap-receipt__filter" data-v-5ae9923b=""></div>
                    <img src="/scan-text.svg" alt="Snap Receipts Logo" className="snap-receipt__logo w-18"
                         data-v-5ae9923b=""/></div>
            </div>
        </LayoutContainer>
    );
}

export const Route = createFileRoute('/')({
    component: Root,
});
