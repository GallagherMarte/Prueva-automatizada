const { Builder, By, Key, until, WebElement } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');
const assert = require('assert');
const fs = require('fs');
const path = require('path')
const mocha = require('mocha');


describe('Pruebas del formulario de inscripción', function () {
    this.timeout(60000);

    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://127.0.0.1:5501/inscripcion.html');
    });

    after(async function () {
        await driver.quit();
    });

    it('Debe verificar campos vacíos del formulario', async function () {
        await ComposvaciosFormulario(driver);
    });

    it('Debe limpiar el formulario', async function () {
        await LimpiarFormulario(driver);
    });

    it('Debe registrar datos en el formulario', async function () {
        await registrarFormulario(driver);
    });

    it('Debe seleccionar y validar horarios', async function () {
        await seleccionarHorarios(driver);
    });

    it('Debe finalizar el registro', async function () {
        await finalizarRegistro(driver);
    });
});


// Función para tomar captura de pantalla
async function tomarCaptura(driver, nombreArchivo) {
    try {

        const rutaCompleta = path.resolve(__dirname, 'capturas', nombreArchivo);


        const carpeta = path.dirname(rutaCompleta);
        if (!fs.existsSync(carpeta)) {
            fs.mkdirSync(carpeta, { recursive: true });
        }


        let screenshot = await driver.takeScreenshot();
        fs.writeFileSync(rutaCompleta, screenshot, 'base64');
        console.log(`Captura de pantalla guardada como: ${rutaCompleta}`);
    } catch (error) {
        console.error(`Error al guardar la captura de pantalla: ${error.message}`);
    }
}

async function ComposvaciosFormulario(driver) {
    console.log('Historia 1: Campos vacíos formulario...');


    await driver.findElement(By.id('nombre')).sendKeys('Juan Pérez');
    await driver.findElement(By.id('provincia')).sendKeys('Santo Domingo');
    await driver.findElement(By.id('Ciudad')).sendKeys('Distrito Nacional');

    let carreraSelect = await driver.findElement(By.id('carrera'));
    let select = new Select(carreraSelect);
    await select.selectByVisibleText('Multimedia');


    // Tomar captura de pantalla antes de registrar
    await tomarCaptura(driver, 'bacio_formulario_registro.png');

    await driver.sleep(1000)

    // Registrar
    await driver.findElement(By.id('registroBtn')).click();

    // Esperar a que se cierre la alerta de campos vacíos, si existe
    try {

        await driver.wait(until.alertIsPresent(), 5000);
        await tomarCaptura(driver, 'error_Campos_vacios_formulario.png');
        let alert = await driver.switchTo().alert();
        console.log(`Alerta detectada: ${await alert.getText()}`);
        await alert.accept();
        await driver.sleep(1000)
        

    } catch (e) {
        console.log('No se presentó una alerta de campos vacíos.');
    }

    await tomarCaptura(driver, 'Rojo_formulario_registro.png');

}


// Historia: Registro de usuario
async function registrarFormulario(driver) {
    console.log('Historia 2: Registrando formulario...');

    // Rellenar campos
    await driver.findElement(By.id('nombre')).sendKeys('Juan Pérez');
    await driver.findElement(By.id('provincia')).sendKeys('Santo Domingo');
    await driver.findElement(By.id('Ciudad')).sendKeys('Distrito Nacional');
    await driver.findElement(By.id('sector')).sendKeys('Gazcue');
    await driver.findElement(By.id('Calle')).sendKeys('Calle 123');
    let carreraSelect = await driver.findElement(By.id('carrera'));
    let select = new Select(carreraSelect);
    await select.selectByVisibleText('Multimedia');

    // Verificar si los campos están correctamente llenados
    let nombre = await driver.findElement(By.id('nombre')).getAttribute('value');
    let provincia = await driver.findElement(By.id('provincia')).getAttribute('value');
    let ciudad = await driver.findElement(By.id('Ciudad')).getAttribute('value');
    let sector = await driver.findElement(By.id('sector')).getAttribute('value');
    let calle = await driver.findElement(By.id('Calle')).getAttribute('value');
    let carrera = await driver.findElement(By.id('carrera')).getAttribute('value');

    console.log(`Campos antes de enviar: ${nombre}, ${provincia}, ${ciudad}, ${sector}, ${calle}, ${carrera}`);

    // Verificar que no hay campos vacíos
    if (!nombre || !provincia || !ciudad || !sector || !calle || !carrera) {
        console.log("¡Error! Hay campos vacíos.");
        await tomarCaptura(driver, 'error_campos_vacios.png');
        return;
    }

    // Tomar captura de pantalla antes de registrar
    await tomarCaptura(driver, 'formulario_registro.png');

    // Registrar
    await driver.findElement(By.id('registroBtn')).click();

    await driver.sleep(1000)



    // Esperar a que se cierre la alerta de campos vacíos, si existe
    try {
        await driver.wait(until.alertIsPresent(), 5000);

        let alert = await driver.switchTo().alert();
        console.log(`Alerta detectada: ${await alert.getText()}`);

        await alert.accept(); // Cerrar la alerta
        await tomarCaptura(driver, 'registro_formulario.png');
    } catch (e) {
        console.log('No se presentó una alerta de campos vacíos.');
    }



    // Verificar confirmación
    let nombreConfirmacion = await driver.findElement(By.id('comNombre')).getText();
    console.log(`Confirmación: ${nombreConfirmacion}`);

    // Tomar captura de pantalla final después del registro
    await tomarCaptura(driver, 'captura_confirmacion.png');
}
// Historia : Limpiar formulario
async function LimpiarFormulario(driver) {
    console.log('Historia 1: Limpiar formulario...');

    // Rellenar campos
    await driver.findElement(By.id('nombre')).sendKeys('Juan Pérez');
    await driver.findElement(By.id('provincia')).sendKeys('Santo Domingo');
    await driver.findElement(By.id('Ciudad')).sendKeys('Distrito Nacional');
    await driver.findElement(By.id('sector')).sendKeys('Gazcue');
    await driver.findElement(By.id('Calle')).sendKeys('Calle 123');
    let carreraSelect = await driver.findElement(By.id('carrera'));
    let select = new Select(carreraSelect);
    await select.selectByVisibleText('Multimedia');





    // Tomar captura de pantalla antes de registrar
    await tomarCaptura(driver, 'captura_formulario_Limpiar.png');

    // Registrar
    await driver.findElement(By.id('limpiarBtn')).click();

    // Esperar a que se cierre la alerta de campos vacíos, si existe




    // Verificar confirmación
    let nombreConfirmacion = await driver.findElement(By.id('comNombre')).getText();
    console.log(`Confirmación: ${nombreConfirmacion}`);

    // Tomar captura de pantalla final después del registro
    await tomarCaptura(driver, 'captura_Limpiar.png');
}




// Historia 3: Seleccionar horarios
async function seleccionarHorarios(driver) {
    console.log('Historia 3: Seleccionando horarios...');

    try {

        const dropdownButton = await driver.findElement(By.id('dropdown-0'));
        await driver.executeScript('arguments[0].scrollIntoView(true);', dropdownButton);
        await driver.wait(until.elementLocated(By.id('dropdown-0')), 15000);
        await driver.wait(until.elementIsVisible(dropdownButton), 15000);
        await driver.executeScript('arguments[0].style.border="2px solid red";', dropdownButton);
        await dropdownButton.click(); // Desplegar el menú

        await tomarCaptura(driver, 'desplegable.png');

        // Paso 2
        const horarioButton = await driver.findElement(By.id('horario-0-1'));
        const radioButton = await horarioButton.findElement(By.css('input[type="radio"]'));
        await driver.executeScript('arguments[0].scrollIntoView(true);', radioButton);

        await driver.wait(until.elementIsEnabled(radioButton), 15000);
        await driver.executeScript('arguments[0].style.border="2px solid blue";', radioButton);

        // Tomar captura antes de hacer clic
        await tomarCaptura(driver, 'antes_de_seleccionar_horario.png');

        await driver.sleep(1000); 

        // Hacer clic en el radio button
        await radioButton.click();


        await driver.findElement(By.id('siguienteBtn')).click();

        // Validar que el input radio está seleccionado
        const isChecked = await inputRadio.isSelected();
        assert.strictEqual(isChecked, true, 'El horario no se seleccionó correctamente');

        
        console.log('Horario seleccionado correctamente.');
    } catch (e) {
        console.error('Error durante la ejecución de la historia 3:', e);
        await tomarCaptura(driver, 'error_seleccion_horarios.png');
    }
}



// Historia 5: Finalizar registro
async function finalizarRegistro(driver) {
    console.log('Historia 5: Finalizando registro...');

    // Captura antes de finalizar
    await tomarCaptura(driver, 'captura_antes_finalizar.png');

    try {
        // Espera explícitamente hasta que el botón sea visible e interactuable
        const finalizarBtn = await driver.wait(until.elementLocated(By.id('finalizarBtn')), 5000);
        await driver.wait(until.elementIsVisible(finalizarBtn), 5000); // Espera hasta que el botón sea visible
        await finalizarBtn.click(); // Hacer clic en el botón

        // Captura después de finalizar



        await driver.wait(until.alertIsPresent(), 5000);
       
        let alert = await driver.switchTo().alert();
        console.log(`Alerta detectada: ${await alert.getText()}`);
        await alert.accept();
        console.log("Alerta de confirmación manejada correctamente.");
    } catch (e) {
        console.error('Error: No se presentó o no se pudo manejar la alerta de confirmación.', e);
    }

    // Validar mensaje de confirmación
    try {
        const mensajeFinal = await driver.findElement(By.id('mensajeConfirmacion')).getText();
        assert.strictEqual(mensajeFinal, 'Registro completado exitosamente', 'No se mostró el mensaje de confirmación esperado');
        console.log('Registro finalizado correctamente.');
    } catch (e) {
        console.error('Error al validar el mensaje de confirmación:', e);
    }
}





