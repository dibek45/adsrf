import { ApplicationRef, ComponentRef, Injectable, Injector, createComponent, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBoletosSeleccionados } from '../state/boleto/boleto.selectors';
import { take } from 'rxjs/operators';
import * as BoletoActions from '../state/boleto/boleto.actions'; // ajusta la ruta si es distinta
import { Boleto } from '../state/boleto/boleto.model';
@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {
  private store = inject(Store);
  private appRef = inject(ApplicationRef);
  private injector = inject(Injector);
  private readonly numeroWhatsApp = '5216146087479';
  private readonly cuentaSTP = '728969000032810021';


  MEJORES_FRASES_SUERTE: string[] = [
  "La suerte es loca... y a cualquiera le toca 🍀",
  "Te deseo mucha suerte 🍃",
  "Que tengas la mejor de las suertes 🙌🏽",
  "Gracias por participar, suerte 🌀",
  "¡Mucha suerte desde ya! 💪",
  "Tienes números potentes, mucha suerte ⚡",
  "Vamos con toda la suerte 💯",
  "Confío en tu suerte hoy 🧠🍀",
  "Tu número puede sorprenderte, mucha suerte!",
  "Un empujón de suerte para ti 🚀"
];
enviarMensajeDeConsulta(nombre: string, telefono: string): void {
  const fraseAleatoria = this.MEJORES_FRASES_SUERTE[
    Math.floor(Math.random() * this.MEJORES_FRASES_SUERTE.length)
  ];

  const mensaje = `
🍀 *¡Gracias por participar, ${nombre || 'amig@'}!* 🍀

Puedes consultar tus boletos en el siguiente enlace:
🔎 https://sorteos.sa.dibeksolutions.com/consular-boleto

${fraseAleatoria}
`;

  this.enviarMensaje(telefono, mensaje);
}



  private enviarMensaje(numero: string, mensaje: string) {
  const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

}
