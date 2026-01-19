import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Type,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ModalComponent } from './modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalContainerService {
  private applicationRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  private modalInstances = new Map<string, ModalInstance>();
  private modalCounter = 0;

  openComponent<T>(component: Type<T>, config?: ModalConfig): ModalRef {
    const modalId = `modal-${++this.modalCounter}`;

    const modalRef = createComponent(ModalComponent, {
      environmentInjector: this.injector,
    });

    const modalInstance: ModalInstance = {
      id: modalId,
      componentRef: modalRef,
      config: { data: config?.data, size: config?.size, centered: config?.centered },
      closeSubject: new Subject<any>(),
    };

    this.modalInstances.set(modalId, modalInstance);

    modalRef.instance.modalId = modalId;
    modalRef.instance.config = { data: config?.data };
    modalRef.instance.size = config?.size || 'default';
    modalRef.instance.centered = config?.centered ?? false;

    modalRef.instance.close = () => {
      this.close(modalId);
    };

    modalRef.instance.childType.set(component);

    this.applicationRef.attachView(modalRef.hostView);

    const modalDomElem = (modalRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(modalDomElem);

    this.updateZIndexes();
    this.updateBodyScroll();

    return {
      id: modalId,
      close: (result?: any) => this.close(modalId, result),
      onClose: modalInstance.closeSubject.asObservable(),
    };
  }

  open(config: ModalConfig): ModalRef {
    const modalId = `modal-${++this.modalCounter}`;

    const componentRef = createComponent(ModalComponent, {
      environmentInjector: this.injector,
    });

    const modalInstance: ModalInstance = {
      id: modalId,
      componentRef,
      config,
      closeSubject: new Subject<any>(),
    };

    this.modalInstances.set(modalId, modalInstance);

    componentRef.instance.modalId = modalId;

    componentRef.instance.close = () => {
      this.close(modalId);
    };

    this.applicationRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.updateZIndexes();
    this.updateBodyScroll();

    return {
      id: modalId,
      close: (result?: any) => this.close(modalId, result),
      onClose: modalInstance.closeSubject.asObservable(),
    };
  }

  close(modalId: string, result?: any): void {
    const modalInstance = this.modalInstances.get(modalId);
    if (!modalInstance) return;

    modalInstance.closeSubject.next(result);
    modalInstance.closeSubject.complete();

    this.applicationRef.detachView(modalInstance.componentRef.hostView);
    modalInstance.componentRef.destroy();

    if (modalInstance.contentRef) {
      this.applicationRef.detachView(modalInstance.contentRef.hostView);
      modalInstance.contentRef.destroy();
    }

    this.modalInstances.delete(modalId);

    this.updateBodyScroll();
    this.updateZIndexes();
  }

  closeAll(): void {
    const modalIds = Array.from(this.modalInstances.keys());
    modalIds.forEach((id) => this.close(id));
  }

  private updateZIndexes(): void {
    let zIndex = 1000;
    this.modalInstances.forEach((instance) => {
      const domElem = (instance.componentRef.hostView as any).rootNodes[0] as HTMLElement;
      const wrapper = domElem.querySelector('.rd-modal-wrapper') as HTMLElement;

      if (wrapper) {
        wrapper.style.zIndex = zIndex.toString();
      }

      zIndex += 10;
    });
  }

  private updateBodyScroll(): void {
    if (this.modalInstances.size > 0) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('rd-modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('rd-modal-open');
    }
  }
}

export interface ModalConfig {
  data?: any;
  size?: 'small' | 'default' | 'large' | 'full';
  centered?: boolean;
}

export interface ModalRef {
  id: string;
  close: (result?: any) => void;
  onClose: ReturnType<Subject<any>['asObservable']>;
}

interface ModalInstance {
  id: string;
  componentRef: ComponentRef<ModalComponent>;
  config: ModalConfig | { title: string; data?: any };
  closeSubject: Subject<any>;
  contentRef?: ComponentRef<any>;
}
