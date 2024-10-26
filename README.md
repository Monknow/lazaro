# Proyecto Lázaro

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Instalación](#instalación)
- [Uso](#uso)
- [Contribuidores](#contribuidores)
- [Licencia](#licencia)

---

## Descripción General

Lázaro busca reducir la brecha digital que enfrentan los adultos mayores al interactuar con dispositivos electrónicos y la internet. Además de brindarles herramientas prácticas, también prioriza la seguridad y la prevención contra posibles amenazas en línea.

## Instalación

Sigue estos pasos para instalar Lázaro:

### Requisitos Previos
- *Anaconda Navigator*: Asegúrate de tener instalado [Anaconda Navigator](https://www.anaconda.com/products/distribution).
- *Python 3.12* o superior.
- *CUDA 12.6* [Enlace](https://developer.nvidia.com/cuda-downloads).

### Descripción

Lázaro utiliza un sistema de logs para registrar eventos importantes durante su ejecución. Esto permite a los desarrolladores y administradores monitorear el comportamiento del sistema y detectar posibles errores o problemas.


### Instrucciones de Instalación

1. *Clona el Repositorio*:

    bash
    git clone https://github.com/Monknow/lazaro.git
    

2. *Configura el Entorno Conda*:

    Abre una terminal en la raíz del proyecto y ejecuta los siguientes comandos para crear y activar un entorno llamado omniparser:

    bash
    conda create -n "omniparser" python=3.12 -y
    conda activate omniparser
    

3. *Instala las Dependencias (Dentro del CommandPromnt de AnacondaNavigator)*:

    bash
    pip install -r requirements.txt
    conda install pytorch torchvision torchaudio pytorch-cuda=12.4 -c pytorch -c nvidia
    

4. *Inicia el Servidor*:

    Navega al directorio backend e inicia el servidor:

    bash
    cd backend
    python -m uvicorn main:app --reload
    

    El servidor debería estar corriendo en http://127.0.0.1:8000.

## Contribuidores

- [Monknow](https://github.com/Monknow)
- [Aqpipo](https://github.com/aqpipo)
- [KangminKimSPDU](https://github.com/KangminKimSPDU)
- [Webaxol](https://github.com/webaxol)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para obtener más detalles.

```plaintext
MIT License

...

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.