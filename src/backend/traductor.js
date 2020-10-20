import { TS, TIPO_DATO, SENTENCIAS, TIPO_VARIABLE, TIPO_OPERACION, TIPO_VALOR, TIPO_ACCESO } from "./instrucciones";

export default function Traucir(salida, consola, traduccion, printedTable, tablero){
    const contadores = {temporales:4, etiquetas:0};
    const arreglos = {uno:0, dos:0, tres:0, cuatro:0, cinco:0};
   //const arreglos = [];
    const pilas = {stack:0, heap:0};
    const stack = [], heap=[];
   let output="";
   printedTable.erEj=salida.ErrArr;
   const tsGlobal = new TS([], consola);
   try {
        consola.value="void main()\n{\n";
        setSalida(salida.Errores);       
        scanForTypes(salida.AST, tsGlobal); 
        scanForFunctions(salida.AST, tsGlobal, "Global");
        let returnedAcction =  procesarBloque(salida.AST, tsGlobal, "Global");
        if(returnedAcction!=undefined){
            if(returnedAcction.sentencia===SENTENCIAS.BREAK){
                consola.value+='>ERROR: Break fuera de un ciclo.';  
                throw '>ERROR: Break fuera de un ciclo.';  
            }else if(returnedAcction.sentencia===SENTENCIAS.RETURN){
                consola.value+='>ERROR: Return fuera de una función.';  
                throw '>ERROR:Return fuera de una función.';  
            }else if(returnedAcction.sentencia===SENTENCIAS.CONTINUE){
                consola.value+='>ERROR: Continue fuera de un ciclo.';  
                throw '>ERROR: Continue fuera de un ciclo.';  
            }
        }
        consola.value="#include <stdio.h> //Importar para el uso de Printf\n#include <stdlib.h> //Importar malloc\nfloat heap[16384]; //Estructura para heap\nfloat stack[16394]; //Estructura para stack\nfloat p; //Puntero P\nfloat h; //Puntero H\nfloat "+printTemporales()+funcionesNativas()+consola.value+"\nreturn;\n}\n";
        //traduccion.setValue(output);
        console.log(tsGlobal);
        sendTable(tsGlobal);
    } catch (e) {
        console.error(e);
        return;
    }
    function procesarBloque(instrucciones, tablaDeSimbolos, ambito){
        for(let instruccion of instrucciones){
            if (instruccion.sentencia === SENTENCIAS.DECLARACION) {
                try{
                    procesarDeclaracion(instruccion, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.ASIGNACION) {
                try{
                    procesarAsigacion(instruccion, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia === SENTENCIAS.IMPRIMIR){
                try{
                    procesarImpresion(instruccion.valor, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia === SENTENCIAS.ACCESO){
                try{
                    procesarAccID(instruccion.id, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia === SENTENCIAS.IF){                
                try{
                    let returnedAcction = procesarIf(instruccion, tablaDeSimbolos, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.FOR) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarFor(instruccion, tsFor, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.FOR_OF) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarForOF(instruccion, tsFor, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.FOR_IN) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarForIn(instruccion, tsFor, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.WHILE) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarWhile(instruccion, tsFor, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.DO_WHILE) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarDoWhile(instruccion, tsFor, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                        console.error(e);
                    }
            }else if(instruccion.sentencia === SENTENCIAS.LLAMADA){ 
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);               
                    procesarLlamada(instruccion, tsFor, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.INCREMENTO){
                try{
                    procesarUnicambios(instruccion, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.DECREMENTO  ){
                try{
                    procesarUnicambios(instruccion, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.ASIGNACION_SUMA  ){
                try{
                    procesarUnicambios(instruccion, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.ASIGNACION_RESTA  ){
                try{
                    procesarUnicambios(instruccion, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia === SENTENCIAS.SWITCH){ 
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);               
                    let returnedAcction =  procesarSwitch(instruccion, tsFor, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.BREAK){
                try{
                    return {sentencia:SENTENCIAS.BREAK};
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.CONTINUE){
                try{
                    return {sentencia:SENTENCIAS.CONTINUE};
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.RETURN){
                try{
                    if(instruccion.valor=="Epsilon"){
                    return {sentencia:SENTENCIAS.RETURN, valor:"undefined"};
                    }else{
                        return {sentencia:SENTENCIAS.RETURN, valor:procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito)};
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.GRAFICAR_TS){
                try{
                    const tsFor = new TS(JSON.parse(JSON.stringify(tablaDeSimbolos.simbolos)), consola);  
                    graficar_Ts(tsFor, ambito);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
    function setSalida(Errores){
        if(Errores.length>0){
        consola.value+="ALERTA:\nExisten errores, consulta la tabla de errores para localizarlos.\nNota: Si son errores sintácticos intenta ver las línea superiores para hallar el causante.\n\n";
        return;
        }
        for(let error of Errores){
            consola.value+="> "+error+"\n";
        }
    }
    function sendTable(tablaDeSimbolos){
        printedTable.tsEj=tablaDeSimbolos;
    }
    function scanForFunctions(instrucciones, tablaDeSimbolos, ambito){
        for(let instruccion of instrucciones){
                if(instruccion.sentencia==SENTENCIAS.FUNCION){
                    if(ambito=="Global"){ 
                            if(tablaDeSimbolos.existe(instruccion.id, ambito, "funcion")){
                                consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+'\n>ERROR: No se soporta la sobrecarga de funciones, id repetido :'+instruccion.id;  
                                throw '>ERROR: No se soporta la sobrecarga de funciones, id repetido :'+instruccion.id;
                            }  
                            let dataType = procesarDataType(instruccion.tipo);
                            console.log(tablaDeSimbolos.existe(dataType.split("[]")[0], undefined, "type"));
                            if(tablaDeSimbolos.existe(dataType.split("[]")[0], undefined, "type")==false && dataType.split("[]")[0]!="number" && dataType.split("[]")[0]!="string"&& dataType.split("[]")[0]!="void" && dataType.split("[]")[0]!="boolean"){
                                consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+'\n>ERROR: Type '+dataType.split("[]")[0]+' no ha sido definido y es el tipo de retorno de la función:'+instruccion.id;  
                                throw '>ERROR: Type '+dataType.split("[]")[0]+' no ha sido definido y es el tipo de retorno de la función:'+instruccion.id;  
                            }
                            tablaDeSimbolos.agregarFuncion(instruccion.id, procesarDataType(instruccion.tipo), procesarParametros(instruccion.parametros), instruccion.accion, ambito, instruccion.fila, instruccion.columna);
                            scanForFunctions(instruccion.accion, tablaDeSimbolos, instruccion.id);
                    }else{      
                        consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+'\n>ERROR: Funciones anidadas en la función:'+ambito;  
                        throw '>ERROR: Funciones anidadas en la función:'+ambito;
                    } 
                }  
        }    
    }
    function scanForTypes(instrucciones, tablaDeSimbolos){
        for(let instruccion of instrucciones){
            if(instruccion.sentencia==SENTENCIAS.TYPE_DECLARATION){
                tablaDeSimbolos.agregarType(instruccion.id, procesarAtributos(instruccion.atributos), instruccion.fila, instruccion.columna);
            }
        }
    }
    function procesarAtributos(atributos){
        let tempAtributos = [];
        let temp = atributos;
        while(temp!="Epsilon"){
            tempAtributos.push({id:temp.id, tipo: procesarDataType(temp.data_type)});
            temp=temp.next;
        }
        return tempAtributos;
    }
    function procesarDataType(data_description){
        let dimension ="";
        let temp=data_description.isArray;
        while(temp!=false){
            dimension+="[]";
            temp=temp.next_dimension;
        }
        return data_description.tipo+dimension;
    }
    function primitive_Data(tipo){
        if (tipo === TIPO_DATO.NUMBER) {
            return "number";
        }else if (tipo === TIPO_DATO.BOOLEAN) {
            return "boolean";
        }else if (tipo === TIPO_DATO.STRING) {
            return "string";
        }else if (tipo === TIPO_DATO.VOID) {    
            return "void";
        }else{
            return tipo;
        }
    }
    function procesarParametros(parametros){
        let temporal=[];
        let temp = parametros;
        while(temp!="Epsilon"){
            temporal.push({id:temp.id, tipo: procesarDataType(temp.tipo)});
            temp=temp.siguiente;
        }
        return temporal;
    }
    function procesarDeclaracion(instruccion, tablaDeSimbolos, ambito){
        let temp= instruccion;
        while(temp!="Epsilon"){
            crearSimbolo(instruccion.variable_type, temp.id, {tipo:primitive_Data(temp.data_type), isArray:temp.isArray}, temp.expresion, ambito, tablaDeSimbolos, temp.fila, temp.columna);
            temp=temp.next_declaration;
        }
    }
    function procesarAsigacion(instruccion, tablaDeSimbolos, ambito){
        let principalValue = tablaDeSimbolos.getSimbol(instruccion.id.id, SplitAmbitos(ambito), instruccion.fila, instruccion.columna);
        if(principalValue.var_type==TIPO_VARIABLE.CONST && instruccion.id.acc=="Epsilon"){
            consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n>ERROR: No se puede asignar a ' + instruccion.id.id+' porque es una constante.\n';  
            throw '>ERROR:  No se puede asignar a ' + instruccion.id.id+' porque es una constante.\n';   
        }
        let assignedValue = procesarExpresionNumerica(instruccion.expresion, tablaDeSimbolos, ambito);
        let temp = instruccion.id.acc, tipo =principalValue.tipo, direcciones=principalValue.direcciones;
        while(temp!="Epsilon"){
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){//B
                //comprobar que exista la propiedad
                let value = ExistingAttribute(principalValue.tipo, temp.atributo, tablaDeSimbolos);
                //comprobar que el valor sea del mismo tipo del atributo o null
                if(value == false){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No existe el atributo '+temp.atributo+'\n';  
                    throw '>ERROR: No existe el atributo '+temp.atributo+'\n';
                }
                for(let attribute of principalValue.valor){
                    if(attribute.id==temp.atributo){
                        principalValue=attribute.valor;
                        if(principalValue.valor==null){
                            //no estoy seguro si hacerlo así o solo pasarle el tipo
                            principalValue.valor=assignedValue.valor;
                            principalValue.tipo=assignedValue.tipo;
                            return;
                        }
                    }
                }
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){//B
                //comprobar que sea un array
                if(principalValue.tipo.split("[]")==1){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de acceso a posición de array inexistente\n';  
                    printedTable.erEj.push({descripcion:'Intento de acceso a posición de array inexistente',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se reconoce la expresion '+valor.valor+' como un index.\n';  
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }
                let tempTipo="";
                for(let e =0;e<tipo.split("[]").length-1;e++){
                    if(e==0)tempTipo+=tipo.split("[]")[e];
                    else tempTipo+="[]";
                }
                tipo=tempTipo;
                //consola.value+=principalValue.direcciones+"["+valor.valor+"]="+valor.valor;
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+direcciones+"["+valor.valor+"];\n";
                direcciones=temporal;
                //principalValue.valor = assignedValue;
            }else {
                consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';  
                throw '>ERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';
            }
            temp=temp.next_acc;
        }
       /* if(principalValue.tipo.split("[]")[0]=="undefined"){
            principalValue.valor=assignedValue.valor;
            principalValue.tipo=assignedValue.tipo;
        }else{
            if(assignedValue.valor==null){
                principalValue.valor=assignedValue.valor;
                principalValue.tipo=assignedValue.tipo;
            }else */
            if(tipo!=assignedValue.tipo){
                consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: Incompatibilidad de tipos: ' + assignedValue.tipo + ' no se puede convertir en ' + principalValue.tipo+'\n';  
                throw '>ERROR: Incompatibilidad de tipos: ' + assignedValue.tipo + ' no se puede convertir en ' + principalValue.tipo+'\n';                
            }else{
                if(tipo=="number"||principalValue.tipo=="boolean"){
                    //let temporal = nuevoTemporal();
                    let pila = (ambito=="Global")?"heap":"stack";
                    consola.value+=pila+"[(int)"+direcciones+"]="+assignedValue.valor+";\n";
                }else{
                    principalValue.direcciones=assignedValue.valor;
                }
               // principalValue.valor=assignedValue.valor;
            }
        //}
        //obtener el valor a cambiar y ver que  no sea const
        //
    }
    function procesarImpresion(expresion, tablaDeSimbolos, ambito){
        const valores = procesarTexto(expresion, tablaDeSimbolos, ambito);
        consola.value+=toString(valores);
    }
    function procesarTexto(expresion, tablaDeSimbolos, ambito){
        if (expresion.sentencia === SENTENCIAS.LLAMADA) {
            const valor = procesarLlamada(expresion, tablaDeSimbolos, ambito);
            if(valor.tipo=="void"){
                consola.value+='>f:'+expresion.fila+', c:'+expresion.columna+', ambito:'+ambito+'\nERROR: Función de tipo void como expresión.\n';  
                printedTable.erEj.push({descripcion:' Función de tipo void como expresión.',tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: Función de tipo void como expresión.'; 
            }
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valor+";\n";
            return {valor:temporal,tipo:"number"};
        } else if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {
            const valor = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            
            if(valor.tipo=="number"){
                let temporal = nuevoTemporal();
                return {valor:valor.valor,tipo:"number", direcciones:temporal};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de resta unitaria con el tipo '+valor.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de resta unitaria con el tipo.'; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.SUMA) {
            //si valIzq es string devuleve string else number
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"+"+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal, tipo:"number"}],tipo:"number"};
            }else if(valorIzq.tipo=="number" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"+"+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal, tipo:"number"}],tipo:"number"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="number"){
                //let temporal = nuevoTemporal();
                //consola.value+=temporal+"="+valorIzq.valor+"+"+valorDer.valor+";\n";
                return {valor:[valorIzq, valorDer],tipo:"string"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"+"+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal, tipo:"number"}],tipo:"number"};
            }else if(valorIzq.tipo=="number" && valorDer.tipo=="string"){
                //let temporal = nuevoTemporal();
                //consola.value+=temporal+"="+valorIzq.valor+"+"+valorDer.valor+";\n";
                return {valor:[valorIzq, valorDer],tipo:"string"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="string"){
                //let temporal = nuevoTemporal();
                //consola.value+=temporal+"="+valorIzq.valor+"+"+valorDer.valor+";\n";
                return {valor:[valorIzq, valorDer],tipo:"string"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"+"+valorDer.valor[0].valor+";\n";
                return {valor:[valorIzq, valorDer],tipo:"string"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de suma con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de suma con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.RESTA) {
                const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
                const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"-"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de resta con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de resta con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MULTIPLICACION) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"*"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de multiplicación con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de multiplicación con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.DIVISION) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                    /*if (valorDer == 0){
                    printedTable.erEj.push({descripcion:' No se puede realizar la operación de división con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                    throw 'Error: división entre 0 no está definida.';
                }*/                
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"/"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de división con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de división con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.POTENCIA) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"*"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de potencia con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de potencia con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MODULO) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"%"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de módulo con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de módulo con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){    
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+">"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de mayor que con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de mayor que con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR_IGUAL) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){    
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+">="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de mayor o igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de mayor o igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MENOR) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){    
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"<"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de menor que con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de menor que  con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MENOR_IGUAL) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"<="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de menor igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de menor igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.IGUAL_IGUAL) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de igualdad con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de igualdad con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
            //falta las comparaciones de :
            /*
                type - type
                array - array
                type - null
                array - null
                string - null
                null - null
            */
        } else if (expresion.tipo === TIPO_OPERACION.DISTINTO) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de diferenciación con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de diferenciación con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
            //falta las diferenciación de :
            /*
                type - type
                array - array
                type - null
                array - null
                string - null
                null - null
            */
        } else if (expresion.tipo === TIPO_OPERACION.AND) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"&&"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de AND con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de AND con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.OR) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"||"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de OR con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de OR con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.NOT) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="boolean"){    
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=!"+valorIzq.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de NOT con el tipos:'+valorIzq.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de NOT con el tipos:'+valorIzq.tipo; 
            }
        }else if(expresion.tipo ==  TIPO_OPERACION.CONCATENACION){
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            return {valor:[valorIzq, valorDer], tipo:"concatenacion"};
        } else if (expresion.tipo === TIPO_VALOR.NUMERO) {
            return {valor:[{valor:expresion.valor, tipo:"number"}], tipo:"number"};
        } else if (expresion.tipo === TIPO_VALOR.DECIMAL) {
            return {valor:[{valor:expresion.valor, tipo:"number"}], tipo:"number"};
        }else if (expresion.tipo === TIPO_VALOR.TRUE) {
            return {valor:[{valor:"1", tipo:"boolean"}], tipo:"boolean"};
        } else if (expresion.tipo === TIPO_VALOR.FALSE) {
            return {valor:[{valor:"0", tipo:"boolean"}], tipo:"boolean"};
        } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
            const valIzq=procesarAccID(expresion.valor, tablaDeSimbolos, ambito);
            return  {valor:[valIzq], tipo:valIzq.tipo};
        }else if (expresion.tipo === TIPO_VALOR.CADENA) {
            let initial = nuevoTemporal();
            let direcciones = pilas.heap;
            consola.value+=initial+"=h;\n";
            let cadenaUpdated =  sustituirEscapes(expresion);
            for(let i =0;i<cadenaUpdated.length;i++){
                consola.value+="heap[(int)h]="+ cadenaUpdated.charCodeAt(i)+";\nh=h+1;\n";
                heapPush();
            }
            consola.value+="heap[(int)h]=-1;\nh=h+1;\n";
            heapPush();
            return {valor:[{valor:initial, tipo: "string"}], tipo: "string", direcciones:initial};
        } else if (expresion.tipo === TIPO_VALOR.CADENA_CHARS) {
            let initial = nuevoTemporal();
            let direcciones = pilas.heap;
            consola.value+=initial+"=h;\n";
            let cadenaUpdated =  sustituirEscapes(expresion);
            for(let i =0;i<cadenaUpdated.length;i++){
                consola.value+="heap[(int)h]="+ cadenaUpdated.charCodeAt(i)+";\nh=h+1;\n";
                heapPush();
            }
            consola.value+="heap[(int)h]=-1;\nh=h+1;\n";
            heapPush();
            return { valor: [{valor:initial, tipo: "string"}], tipo: "string" , direcciones:initial};
        } else if(expresion.tipo===TIPO_DATO.OPERADOR_TERNARIO){
            let logica =  procesarTexto(expresion.logica, tablaDeSimbolos, ambito);
            if(logica.tipo=="boolean"){
                return logica.valor? procesarTexto(expresion.result1, tablaDeSimbolos, ambito):procesarTexto(expresion.result2, tablaDeSimbolos, ambito);
            }
        } else {
            throw 'ERROR: expresión numérica no válida: ' + expresion.valor;
        }
    }
    function toString(cadena, tablaDeSimbolos, ambito){
        let text= "";
        if(Array.isArray(cadena.valor)){
            text+=toString(cadena.valor, tablaDeSimbolos, ambito);
        }else{
                for(let elem of cadena){
                if(Array.isArray(elem.valor)){
                    text+=toString(elem.valor, tablaDeSimbolos, ambito);
                }else if(elem.tipo=="number"){
                    if(typeof elem.valor === 'number'){
                        if(elem.valor%1===0){
                            text+="printf(\"%d\", (int)"+elem.valor+");\n"; 
                        }else{
                           text+="printf(\"%f\", (float)"+elem.valor+");\n"; 
                        }
                    }else {
                        text+="printf(\"%f\", "+elem.valor+");\n";
                    }              
                }else if(elem.tipo=="boolean"){
                    if(elem.valor.charAt(0)=="t"){
                        text+="printf(\"%d\", (int)"+elem.valor+");\n";
                    }else{
                        text+="printf(\"%d\", (int)"+elem.valor+");\n";
                    }               
                }else if(elem.tipo=="string"){
                    text+="t0="+elem.valor+";\nimprimir();\n";
                }
            } 
        }   
        return text;
    }
    function sustituirEscapes(cadena){
        cadena.valor=String(cadena.valor).replace(/\\n/g,'\n')
        cadena.valor=String(cadena.valor).replace(/\\t/g,'\t')
        cadena.valor=String(cadena.valor).replace(/\\r/g,'\r')
        cadena.valor=String(cadena.valor).replace(/\\"/g,'\"')
        cadena.valor=String(cadena.valor).replace(/\\\\"/g,'\\')
        return cadena.valor;
    }
    function crearSimbolo(var_type, id, data_type, valor, ambito, tablaDeSimbolos, fila, columna){
        consola.value+="//comienza declaracion de variable "+id+"\n";
        //Verificar que exista el tipo de dato de la variable
        data_type=procesarDataType(data_type);  //establece el tipo de la variable que es obligatorio declarar
        if(!tablaDeSimbolos.existe(data_type.split("[]")[0], undefined, "type") && data_type.split("[]")[0]!="number" && data_type.split("[]")[0]!="string" && data_type.split("[]")[0]!="boolean"){
            consola.value+='>f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: No existe el tipo de dato:'+data_type.split("[]")[0]+'.\n';  
            printedTable.erEj.push({descripcion:'No existe el tipo de dato:'+data_type.split("[]")[0]+'.',tipo:"semántico", linea:fila, columna:columna,ambito:ambito});
            throw '>ERROR: No existe el tipo de dato:'+data_type.split("[]")[0]+'.'; 
        }
        
        //Verificar que no exista en el mismo ámbito
        if(tablaDeSimbolos.existe(id, ambito, "variable")){
            consola.value+='>f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito.\n';  
            printedTable.erEj.push({descripcion:'El identificador:\"'+id+'\" ya ha sido declarado en este ámbito',tipo:"semántico", linea:fila, columna:columna,ambito:ambito});
            throw '>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito'; 
        }
        
        //Ver que el tipo de símbolo sea el correcto con el del valor o undefined
        if(var_type==TIPO_VARIABLE.CONST && valor == "undefined"){
            consola.value+='>f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: La delcaracion de la constante '+id+' debe ser inicializada.\n';  
            printedTable.erEj.push({descripcion:'La delcaracion de  la constante '+id+' debe ser inicializada.\n',tipo:"semántico", linea:fila, columna:columna,ambito:ambito});
            throw '>ERROR:La delcaracion de  la constante '+id+' debe ser inicializada.\n';             
        }
        let heapInit = pilas.heap;
        if(valor!="undefined"){
            valor=procesarExpresionNumerica(valor, tablaDeSimbolos, ambito, data_type.split("[]")[0]);
            if(valor.tipo=="number"||valor.tipo=="boolean"){
                valor.direcciones=pilas.heap;
                if(valor.reference==true){
                    let temp = nuevoTemporal();
                    let pila = (ambito=="Global")?"heap":"stack";
                    /*valor.direcciones=nuevoTemporal();
                    consola.value+=valor.direcciones+"=h;\nh=h+1;\n";
                    consola.value+=temp+"=heap[(int)"+valor.valor+"];\nheap[(int)"+valor.direcciones+"]="+temp+";\n";*/
                    valor.direcciones=nuevoTemporal();
                    consola.value+=temp+"="+valor.valor+";\n";
                    consola.value+=valor.direcciones+"=h;\n";
                    consola.value+=pila+"[(int)"+valor.direcciones+"]="+temp+";\n";
                    
                }else{
                    valor.direcciones=nuevoTemporal();
                    consola.value+=valor.direcciones+"=h;\n";
                    consola.value+="heap[(int)"+valor.direcciones+"]="+valor.valor+";\nh=h+1;\n";
                }
                heapPush();
            }
            if(valor.reference && valor.tipo!="number" && valor.tipo !="boolean"){
                heapInit=valor.valor;
                valor.direcciones=valor.valor;
            }
        }else{
            if(data_type=="number"){
                valor={valor:0,tipo:"number", direcciones:nuevoTemporal()};
                consola.value+=valor.direcciones+"=h;\n"
                consola.value+="heap[(int)"+valor.direcciones+"]=0;\nh=h+1;";
                heapPush();
            }else if(data_type=="boolean"){
                valor={valor:0, tipo:"boolean"};
                consola.value+="heap[(int)"+valor.direcciones+"]=false;\nh=h+1;";
                heapPush();
            }else{
                valor={valor:0, tipo:data_type};
                consola.value+="heap[(int)h]=0;\nh=h+1;";
            }
        }
        if(data_type!=valor.tipo){  //se descarta la inferencia de tipos
            consola.value+='f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + data_type+".\n";
            printedTable.erEj.push({descripcion:'Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + data_type,ambito:ambito,tipo:"semántico", linea:fila, columna:columna});
            throw 'ERROR: Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + data_type;
        }
        //Crear simbolo
        if(valor.tipo.split("[]").length>1 || tablaDeSimbolos.existe(valor.tipo.split("[]")[0], undefined, "type") || ambito=="Global" || valor.tipo=="string"){
            //se va  al heap
            if(valor.tipo=="string"){
                tablaDeSimbolos.agregar(var_type, id, data_type, ambito, fila, columna, valor.valor);
            }else if(valor.tipo.split("[]").length>1){
                tablaDeSimbolos.agregar(var_type, id, data_type, ambito, fila, columna, valor.direcciones);
            }else{
                //consola.value+="heap[(int)h]="+ valor.valor+";\nh=h+1;\n";
                tablaDeSimbolos.agregar(var_type, id, data_type, ambito, fila, columna, valor.direcciones);
            }
        }else{
            //se va al stack
            consola.value+="stack[(int)p]="+ valor.valor+";\np=p+1;\n";
            tablaDeSimbolos.agregar(var_type, id, data_type, ambito, fila, columna, stackPush());
        }
        consola.value+="//termina declaracion de variable "+id+"\n";
    }
    function procesarExpresionNumerica(expresion, tablaDeSimbolos, ambito, userType) {
        if (expresion.sentencia === SENTENCIAS.LLAMADA) {
            const valor = procesarLlamada(expresion, tablaDeSimbolos, ambito);
            if(valor.tipo=="void"){
                consola.value+='>f:'+expresion.fila+', c:'+expresion.columna+', ambito:'+ambito+'\nERROR: Función de tipo void como expresión.\n';  
                printedTable.erEj.push({descripcion:' Función de tipo void como expresión.',tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: Función de tipo void como expresión.'; 
            }
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valor+";\n";
            return {valor:temporal,tipo:"number"};
        } else if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {
            const valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            
            if(valor.tipo=="number"){
                let temporal = nuevoTemporal();

                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de resta unitaria con el tipo '+valor.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de resta unitaria con el tipo.'; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.SUMA) {
            //si valIzq es string devuleve string else number
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"+"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else if(valorIzq.tipo=="number" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"+"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorIzq.valor+";\n";
                consola.value+="t3="+valorDer.valor+";\n";
                consola.value+="conStrNum();\n";
                return {valor:temporal,tipo:"string"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"+"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else if(valorIzq.tipo=="number" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorDer.valor+";\n";
                consola.value+="t3="+valorIzq.valor+";\n";
                consola.value+="conNumStr();\n";
                return {valor:temporal,tipo:"string"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorIzq.valor+";\n";
                consola.value+="t3="+valorDer.valor+";\n";
                consola.value+="concatenar();\n";
                return {valor:temporal,tipo:"string"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorIzq.valor+";\n";
                consola.value+="t3="+valorDer.valor+";\n";
                consola.value+="conStrNum();\n";
                return {valor:temporal,tipo:"string"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorDer.valor+";\n";
                consola.value+="t3="+valorIzq.valor+";\n";
                consola.value+="conNumStr();\n";
                return {valor:temporal,tipo:"string"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de suma con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de suma con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.RESTA) {
                const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
                const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"-"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de resta con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de resta con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MULTIPLICACION) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"*"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de multiplicación con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de multiplicación con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.DIVISION) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                    /*if (valorDer == 0){
                    printedTable.erEj.push({descripcion:' No se puede realizar la operación de división con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                    throw 'Error: división entre 0 no está definida.';
                }*/                
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"/"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de división con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de división con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.POTENCIA) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"*"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de potencia con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de potencia con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MODULO) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"%"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de módulo con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de módulo con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){    
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+">"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de mayor que con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de mayor que con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){    
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+">="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de mayor o igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de mayor o igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MENOR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){    
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"<"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de menor que con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de menor que  con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MENOR_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"<="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de menor igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de menor igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.IGUAL_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de igualdad con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de igualdad con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
            //falta las comparaciones de :
            /*
                type - type
                array - array
                type - null
                array - null
                string - null
                null - null
            */
        } else if (expresion.tipo === TIPO_OPERACION.DISTINTO) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de diferenciación con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de diferenciación con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
            //falta las diferenciación de :
            /*
                type - type
                array - array
                type - null
                array - null
                string - null
                null - null
            */
        } else if (expresion.tipo === TIPO_OPERACION.AND) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"&&"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de AND con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de AND con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.OR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"||"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de OR con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de OR con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.NOT) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="boolean"){    
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=!"+valorIzq.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de NOT con el tipos:'+valorIzq.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de NOT con el tipos:'+valorIzq.tipo; 
            }
        } else if (expresion.tipo === TIPO_VALOR.NUMERO) {
            return {valor:expresion.valor, tipo:"number"};
        } else if (expresion.tipo === TIPO_VALOR.DECIMAL) {
            return {valor:expresion.valor, tipo:"number"};
        }else if (expresion.tipo === TIPO_VALOR.TRUE) {
            return {valor:"1", tipo:"boolean"};
        } else if (expresion.tipo === TIPO_VALOR.FALSE) {
            return {valor:"0", tipo:"boolean"};
        } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
            const valIzq=procesarAccID(expresion.valor, tablaDeSimbolos, ambito);
            return  valIzq;
        } else if (expresion.tipo === TIPO_VALOR.NULL) {
            return { valor: "0", tipo: userType , tamanio:1};
        } else if (expresion.data_type === TIPO_DATO.ARRAY) {
            return procesarArray(expresion, tablaDeSimbolos, ambito, userType);
        } else if (expresion.tipo.split("[]").length>1){
            return procesarArray(expresion, tablaDeSimbolos, ambito, userType);
        } else if (expresion.tipo === TIPO_DATO.OBJETO) {
            return procesarObjeto(expresion, tablaDeSimbolos, ambito, userType);
        } else if (expresion.tipo === TIPO_VALOR.CADENA) {
            let initial = nuevoTemporal();
            let direcciones = pilas.heap;
            consola.value+=initial+"=h;\n";
            let cadenaUpdated =  sustituirEscapes(expresion);
            for(let i =0;i<cadenaUpdated.length;i++){
                consola.value+="heap[(int)h]="+ cadenaUpdated.charCodeAt(i)+";\nh=h+1;\n";
                heapPush();
            }
            consola.value+="heap[(int)h]=-1;\nh=h+1;\n";
            heapPush();
            return {valor:initial, tipo: "string", direcciones:initial};
        } else if (expresion.tipo === TIPO_VALOR.CADENA_CHARS) {
            let initial = nuevoTemporal();
            let direcciones = pilas.heap;
            consola.value+=initial+"=h;\n";
            let cadenaUpdated =  sustituirEscapes(expresion);
            for(let i =0;i<cadenaUpdated.length;i++){
                consola.value+="heap[(int)h]="+ cadenaUpdated.charCodeAt(i)+";\nh=h+1;\n";
                heapPush();
            }
            consola.value+="heap[(int)h]=-1;\nh=h+1;\n";
            heapPush();
            return { valor: initial, tipo: "string" , direcciones:initial};
        } else if(expresion.tipo===TIPO_DATO.OPERADOR_TERNARIO){
            let logica =  procesarExpresionNumerica(expresion.logica, tablaDeSimbolos, ambito);
            if(logica.tipo=="boolean"){
                return logica.valor? procesarExpresionNumerica(expresion.result1, tablaDeSimbolos, ambito):procesarExpresionNumerica(expresion.result2, tablaDeSimbolos, ambito);
            }
        } else {
            throw 'ERROR: expresión numérica no válida: ' + expresion.valor;
        }
    }
    function procesarArray(arreglo, tablaDeSimbolos, ambito, userType){
        consola.value+="//comienza arreglo \n";
        let temporal = [], tipo="";
        let temp = arreglo.dimension;
        let tamanio=0, direcciones=[],temporalBegin,arrayHead=contadores.temporales+1;
        //consola.value+="h=h+"+tamanio+";\n";
        tamanio=0;
        temp = arreglo.dimension;
        while(temp!="Epsilon"){
            let dir/*=pilas.heap*/;
            temporalBegin = contadores.temporales;
            //heapPush();
            let valor = procesarExpresionNumerica(temp.dato, tablaDeSimbolos, ambito, userType);
            if(valor.tipo=="boolean"||valor.tipo=="number"){
                dir=nuevoTemporal();
                consola.value+=dir+"="+"h;\n";
                consola.value+="heap[(int)"+dir+"]="+valor.valor+";\nh=h+1;\n";
                direcciones.push(dir);
            }else{
                direcciones.push(valor.direcciones);
                tipo=valor.tipo;
            }            
            temporal.push(valor);
            temp=temp.next_data;
            tamanio++;
        }
        checkForMultyType(JSON.parse(JSON.stringify(temporal)), tablaDeSimbolos, ambito);
        consola.value+="//comienza declaración del arreglo en C3D\n";
        direcciones = declararArregloC3D({direcciones:direcciones, tipo:tipo+"[]"});
        consola.value+="//termina arreglo \n";
        return {tipo:getType(temporal)+calcularDimensiones(temporal), valor:"t"+arrayHead, direcciones:direcciones};
    }
    function checkForMultyType(arreglo, tablaDeSimbolos, ambito){
        arreglo = JSON.parse(JSON.stringify(arreglo));
        if(arreglo.length>1){
            let temp = arreglo.pop();
            for(let temporal of arreglo){
                if(temp.tipo!=temporal.tipo){
                    if(temp.tipo.split("[]")[0]=="undefined" && temporal.tipo.split("[]")[0]=="undefined"){
                        //no es error solo están vacíos
                        arreglo.push(temp);
                    }else if(temp.tipo.split("[]")[0]=="undefined"){
                        temp.tipo=temporal.tipo;
                        arreglo.push(temp);
                    }else if(temporal.tipo.split("[]")[0]=="undefined"){
                        temporal.tipo=temp.tipo;
                        arreglo.push(temp);
                    }else{         
                        arreglo.push(temp);               
                        consola.value+='>ERROR: No se permiten los arreglos multitype->'+toString({valor:arreglo, tipo:TIPO_DATO.ARRAY}, tablaDeSimbolos, ambito);  
                        throw '>ERROR: No se permiten los arreglos multitype'+toString({valor:arreglo, tipo:TIPO_DATO.ARRAY}, tablaDeSimbolos, ambito);
                    }
                }
            }
        }
    }
    function getType(valor){
        while(Array.isArray(valor)){
            valor=valor[0];
        }
        if(valor==undefined) return "undefined";
        return valor.tipo;
    }
    function calcularDimensiones(valor){
        let contador="";
        while(Array.isArray(valor)){
            contador+="[]";
            valor=valor[0];
        }
        return contador;
    }
    function procesarObjeto(instruccion, tablaDeSimbolos, ambito, userType){
        if(!tablaDeSimbolos.existe(userType, undefined, "type")){
            printedTable.erEj.push({descripcion:'No existe el type:'+userType+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
            throw '>ERROR: No existe el type:'+userType+'.\n';                       
        }  
        let attb =[];
        let temp = instruccion.atributos;
        while(temp!="Epsilon"){
            attb.push({id:temp.id});
            temp=temp.next;
        }
        let tipo = tablaDeSimbolos.obtenerType(userType);
        if(tipo.atributos.length!=attb.length){
            printedTable.erEj.push({descripcion:'Se deben inicializar todos los atributos del type.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
            throw '>ERROR: Se deben inicializar todos los atributos del type.\n'; 
        }
        temp = instruccion.atributos;
        //let initial = "t"+(contadores.temporales+1), temporalInit=contadores.temporales+1;
        //declarar los atributos
      /*  consola.value+="//comienza declaracion de objeto de tipo "+userType+" \n";
        for(let atb in attb){
            consola.value+=nuevoTemporal()+"="+"h+"+atb+";\n";
        }*/
        //consola.value+="h=h+"+attb.length+";\n";
        //referenciar los atributos
        let count =0;
        let direcciones = [];
        while(temp!="Epsilon"){
            //consola.value+=nuevoTemporal()+"="+"h;\nh=h+1;\n";
            let temporalHeap = pilas.heap, temporalInit=contadores.temporales+1, dir;
            let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito, userType);
            if(valor.tipo=="number"||valor.tipo=="boolean"){
                dir = nuevoTemporal();
                consola.value+=dir+"=h;\n";
                consola.value+="heap[(int)"+dir+"]="+valor.valor+";\nh=h+1;\n";
                heapPush();
                valor.direcciones=dir;
            }
            //heapPush();
            if(tablaDeSimbolos.existe(tipo.atributos[count].tipo.split("[]")[0], undefined, "type")&&valor.valor=="NULL"){
                if(valor.tipo!=tipo.atributos[count].tipo){
                    printedTable.erEj.push({descripcion:'No coincide el tipo del atributo '+tipo.atributos[count].id+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No coincide el tipo del atributo '+tipo.atributos[count].id+'.\n'; 
                }
            }
            direcciones[count]={id:attb[count].id,direcciones:valor.direcciones};
            //consola.value+="heap[(int)t"+temporalInit+"]="+valor.valor+";\n";
            temp=temp.next;
            temporalInit++;
            count++;
            /**/
        }      
        consola.value+="//termina declaracion de objeto de tipo "+userType+" \n";
        return { tipo:userType, direcciones:direcciones};
    }
    function ExistingAttribute(typeID, attributeID, tablaDeSimbolos){
        let type = tablaDeSimbolos.obtenerType(typeID);
        let contador = 0;
        for(let attribute of type.atributos){
            if(attribute.id==attributeID){
                return {valor:attribute, posicion:contador};
            }
            contador++;
        }
        return false;
    }
    function procesarAccID(instruccion, tablaDeSimbolos, ambito){
        let principalValue = tablaDeSimbolos.obtenerSimbolo(instruccion.id, SplitAmbitos(ambito), instruccion.fila, instruccion.columna);
        //determinar si se busca en el stack o en el heap
        let pila = "";
        if(principalValue.tipo.split("[]").length>1 || tablaDeSimbolos.existe(principalValue.tipo.split("[]")[0], undefined, "type") || ambito=="Global" || principalValue.tipo=="string"){
            pila="heap";
        }else{
            pila="stack";
        }
        //decalarar el primer temporal que comienza a entrar en las posicones dentro del heap
        /*
        let finalDirection = nuevoTemporal();
        if(principalValue.tipo.split("[]").length==1 && !tablaDeSimbolos.existe(principalValue.tipo.split("[]")[0],undefined, "type")){
            consola.value+=finalDirection+"="+pila+"[(int)"+principalValue.valor+"];\n";
        }else{
            consola.value+=finalDirection+"="+principalValue.valor+";\n";
        }
        */
        
        let temp = instruccion.acc;
        while(temp!="Epsilon"){
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){//B
                //comprobar que exista la propiedad
                let value = ExistingAttribute(principalValue.tipo, temp.atributo, tablaDeSimbolos);
                //comprobar que el valor sea del mismo tipo del atributo o null
                if(value == false){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No existe el atributo '+temp.atributo+'\n';  
                    printedTable.erEj.push({descripcion:'No existe el atributo '+temp.atributo+'',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No existe el atributo '+temp.atributo+'\n';
                }
                //para cuando sean atributos nulos
                if(principalValue.valor==null && tablaDeSimbolos.existe(principalValue.tipo, undefined, "type")){
                    break;
                }
              //  consola.value+=finalDirection+"="+finalDirection+"+"+value.posicion+";\n";
                principalValue.valor=principalValue.valor[value.posicion].direcciones;
                principalValue.tipo=value.valor.tipo;
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){//B
                //comprobar que sea un array
                /*
                se crea un conflicto cuando se pasa a una variable del tipo:
                let a : number [][] = [[1,2,3],[4,5,6]];
                let i :number = 0;
                let b:number[] = a[i];  //nose sabría el valor de la posición a menos que se ingrese con un número
                let b : number [] = a[0];                   
                */
                if(principalValue.tipo.split("[]")==1){
                // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de acceso a posición de array inexistente\n';  
                    printedTable.erEj.push({descripcion:'Intento de acceso a posición de array inexistente',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se reconoce la expresion '+valor.valor+' como un index.\n';  
                    printedTable.erEj.push({descripcion:'No se reconoce la expresion '+valor.valor+' como un index.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }
                //principalValue.direcciones = principalValue.direcciones[valor.valor];
                //no sabemos el valor de la posición del array 
                let tipo ="";
                for(let e =0;e<principalValue.tipo.split("[]").length-1;e++){
                    if(e==0)tipo+=principalValue.tipo.split("[]")[e];
                    else tipo+="[]";
                }
                principalValue.tipo=tipo;
                if(principalValue.tipo=="number" || principalValue.tipo=="boolean"){
                    let temporal = nuevoTemporal();
                    consola.value+=temporal+"="+principalValue.valor+"[(int)"+valor.valor+"];\n";
                    principalValue.valor=temporal;
                }else if(principalValue.tipo.split("[]").length>1){
                     let arreglo = nuevoArreglo(principalValue.tipo.split("[]").length-1);
                     consola.value+=arreglo+"="+principalValue.valor+"["+valor.valor+"];\n";
                     principalValue.valor=arreglo;
                }else{
                    principalValue.valor=principalValue.valor+"["+valor.valor+"]";
                }
            }else if(temp.sentencia==SENTENCIAS.LENGTH){//R
                if(!Array.isArray(principalValue.valor)){
                    // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de Length a un array inexistente.\n';  
                    printedTable.erEj.push({descripcion:'Intento de Length a un array inexistente.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: Intento de Length a un array inexistente.\n';                    
                }
                principalValue={valor:principalValue.valor.length, tipo:"number"};
                break;
            }else if(temp.sentencia==SENTENCIAS.CHAR_AT){
                if(principalValue.tipo!="string"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede obtener un CharAt en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede obtener un CharAt en '+principalValue.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No se puede obtener un CharAt en '+principalValue.tipo+'.\n';                    
                }
                let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: '+valor.tipo+' no se puede usar como un índice en CharAt.\n';  
                    printedTable.erEj.push({descripcion:''+valor.tipo+' no se puede usar como un índice en CharAt',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: '+valor.tipo+' no se puede usar como un índice en CharAt.\n';                    
                }
                principalValue.valor=principalValue.valor.charAt(valor.valor);
                break;
            }else if(temp.sentencia==SENTENCIAS.TO_LOWER_CASE){
                if(principalValue.tipo!="string"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede realizar un toLowerCase en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede realizar un toLowerCase en '+principalValue.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No se puede realizar un toLowerCase en '+principalValue.tipo+'.\n';                    
                }
                principalValue.valor=principalValue.valor.toLowerCase();
                break;
            }else if(temp.sentencia==SENTENCIAS.TO_UPPER_CASE){
                if(principalValue.tipo!="string"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede realizar un toUpperCase en '+principalValue.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';                    
                }
                principalValue.valor=principalValue.valor.toUpperCase();
                break;
            }else if(temp.sentencia==SENTENCIAS.CONCAT){
                if(principalValue.tipo!="string"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede realizar un toUpperCase en '+principalValue.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';                    
                }
                let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
                if(valor.tipo!="string" && valor.tipo!="number" && valor.tipo!="boolean" ){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede concatenar '+valor.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede concatenar '+valor.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No se puede concatenar '+valor.tipo+'.\n';                    
                }
                principalValue.valor=principalValue.valor.concat(valor.valor);
                break;
            }
            temp=temp.next_acc;
        }
        if(principalValue.tipo =="number" || principalValue.tipo=="boolean"){
                    principalValue.valor=pila+"[(int)"+principalValue.valor+"]";
                }
        return {valor: principalValue.valor, tipo:principalValue.tipo, reference:true};   
    }
    function SplitAmbitos(name){
        let ar = name.split("_");
        let er =[];
        for(let i =ar.length-1;i>=0;i--){
          let x="";
          for(let e =0;e<=i;e++){
            if(e==0){
              x+=ar[e];
            }else{
              x+="_"+ar[e];
            }    
          }
          er.push(x);
        }
        er.push("Global");
        return er;
    }
    function procesarLlamada(instruccion, tablaDeSimbolos, ambito){
        let funcion = tablaDeSimbolos.obtenerFuncion(instruccion.id, instruccion.fila, instruccion.columna, ambito);
        if(ambito==GetAmbito(instruccion.id) || instruccion.id.split("_").length==1 || instruccion.id==ambito){ //la tercera condición es para que acepte las llamadas recursivas de funciones desasinadas
            if (funcion.parametros.length != 0 && instruccion.parametros == "Epsilon") {
                consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
                printedTable.erEj.push({descripcion:'La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                throw 'ERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
            } else if (funcion.parametros.length == 0 && instruccion.parametros != "Epsilon") {
                consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
                printedTable.erEj.push({descripcion:'La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                throw 'ERROR:La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
            }else{
                let argumentos = getArguments(instruccion.parametros, tablaDeSimbolos, ambito);
                const tsFuncion = new TS(tsGlobal.simbolos.slice(), consola);
                const tsTemp = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                for(let i = 0; i < funcion.parametros.length;i++){
                    if(funcion.parametros[i].tipo=="infer" || funcion.parametros[i].tipo==argumentos[i].tipo){
                        //se acepta el argumento para ser usado por los parámetros
                        tsTemp.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, argumentos[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                        tsFuncion.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, argumentos[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                    }else if(argumentos[i].tipo.split("[]")[0]=="undefined" && funcion.parametros[i].tipo==getType(argumentos[i].valor)+calcularDimensiones(argumentos[i].valor)){
                        //se acepta el argumento para ser usado por los parámetros
                        tsTemp.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, argumentos[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                        tsFuncion.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, argumentos[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                    }else if(tablaDeSimbolos.existe(funcion.parametros[i].tipo, undefined, "type") && argumentos[i].valor==null){
                        //para que acepte los nulls    
                        tsTemp.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, funcion.parametros[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                        tsFuncion.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, funcion.parametros[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                    }else{
                        consola.value+='ERROR:f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados, error de tipos.';
                        printedTable.erEj.push({descripcion:'La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados, error de tipos.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                        throw 'ERROR:La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados, error de tipos.';
                    }
                }               
                let returnedAcction;
                if(instruccion.id.split("_").length>1){
                    returnedAcction = procesarBloque(funcion.accion, tsTemp, instruccion.id);
                }else{
                    returnedAcction = procesarBloque(funcion.accion, tsFuncion, instruccion.id);
                }
                if(returnedAcction!=undefined){
                    /*if(returnedAcction.sentencia===SENTENCIAS.BREAK){
                        consola.value+='>ERROR: Break fuera de un ciclo.';  
                        throw '>ERROR: Break fuera de un ciclo.';  
                    }else*/
                    if(returnedAcction.sentencia===SENTENCIAS.RETURN){
                        if(returnedAcction.valor=="undefined" && funcion.tipo=="void"){
                            return {tipo:"void"};
                            //todo bien
                        }else if(returnedAcction.valor=="undefined" && funcion.tipo!="void"){
                            consola.value+='>ERROR:f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n No se puede asignar void a '+funcion.tipo+'.\n';  
                            printedTable.erEj.push({descripcion:'  No se puede asignar void a '+funcion.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                            throw '>ERROR: No se puede asignar void a '+funcion.tipo+'.'; 
                        }else if(tablaDeSimbolos.existe(instruccion.id, undefined, "type") && returnedAcction.valor.valor==null){
                            //función de un type no nativo devulve null
                        }else if(returnedAcction.valor.tipo.split("[]")[0]=="undefined" && funcion.tipo==getType(returnedAcction.valor.valor)+calcularDimensiones(returnedAcction.valor.valor)){
                            //todo bien
                        }else if(returnedAcction.valor.tipo!=funcion.tipo){
                            consola.value+='>ERROR:f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n No se puede asignar '+returnedAcction.valor.tipo+' a '+funcion.tipo+'.';  
                            printedTable.erEj.push({descripcion:'No se puede asignar '+returnedAcction.valor.tipo+' a '+funcion.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                            throw '>ERROR: No se puede asignar '+returnedAcction.valor.tipo+' a '+funcion.tipo+'.'; 
                        } 
                        return returnedAcction.valor; 
                    }
                }
                //declarar parámetros con los valores de los argumentos
            }
        }else{
            consola.value+='>ERROR:f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n No se puede ejecutar '+instruccion.id+' desde el ámbito '+ambito+'.\n';  
            throw '>ERROR: No se puede ejecutar '+instruccion.id+' desde el ámbito '+ambito+'.\n'; 
        }        
    }
    function GetAmbito(ambito){
        let text="";
        if(ambito!="Global"){
            let temp = ambito.split("_");
            for(let i =0; i<temp.length-1;i++){
                if(i==0){
                    text+=ambito.split("_")[i];
                }else{
                    text+="_"+ambito.split("_")[i];
                }
            }
        }
        return text;
    }
    function getArguments(instruccion, tablaDeSimbolos, ambito){
        let argumentos = [];
        let temp = instruccion;
        while(temp!="Epsilon"){
            argumentos.push(procesarExpresionNumerica(temp.expresion, tablaDeSimbolos, ambito));
            temp=temp.siguiente;
        }
        return argumentos;
    }
    function procesarUnicambios(instruccion, tablaDeSimbolos, ambito){
        let principalValue=getPrincipalValue(instruccion, tablaDeSimbolos, ambito);
        if(principalValue.tipo=="number" || principalValue.tipo=="string"){
            if(instruccion.sentencia==SENTENCIAS.INCREMENTO){
                principalValue.valor++;
            }else if(instruccion.sentencia==SENTENCIAS.DECREMENTO){
                principalValue.valor--;
            }else if(instruccion.sentencia==SENTENCIAS.ASIGNACION_SUMA){
                let valor = procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito);
                if(valor.tipo == "string" ||valor.tipo == "number" ||valor.tipo == "boolean"){
                    principalValue.valor+=valor.valor;
                }else{
                    consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';  
                    throw '>ERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';                    
                }
            }else if(instruccion.sentencia==SENTENCIAS.ASIGNACION_RESTA){
                let valor = procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito);
                if(valor.tipo == "string" ||valor.tipo == "number" ||valor.tipo == "boolean"){
                    principalValue.valor+=valor.valor;
                }else{
                    consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';  
                    throw '>ERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';                    
                }        
            }
        }else{
            consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede usar el operador += con el tipo de dato: ' + principalValue.tipo+'\n';  
            throw '>ERROR: Incompatibilidad de tipos: No se puede usar el operador += con el tipo de dato: ' + principalValue.tipo+'\n'; 
        }
        
    }
    function getPrincipalValue(instruccion, tablaDeSimbolos,ambito){
        let principalValue = tablaDeSimbolos.getSimbol(instruccion.id.id, SplitAmbitos(ambito), instruccion.fila, instruccion.columna);
        if(principalValue.var_type==TIPO_VARIABLE.CONST && instruccion.id.acc=="Epsilon"){
            consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede asignar a ' + instruccion.id.id+' porque es una constante.\n';  
            throw '>ERROR:  No se puede asignar a ' + instruccion.id.id+' porque es una constante.\n';   
        }
        let temp = instruccion.id.acc;
        while(temp!="Epsilon"){
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){//B
                //comprobar que exista la propiedad
                let value = ExistingAttribute(principalValue.tipo, temp.atributo, tablaDeSimbolos);
                //comprobar que el valor sea del mismo tipo del atributo o null
                if(value == false){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No existe el atributo '+temp.atributo+'\n';  
                    throw '>ERROR: No existe el atributo '+temp.atributo+'\n';
                }
                for(let attribute of principalValue.valor){
                    if(attribute.id==temp.atributo){
                        principalValue=attribute.valor;
                    }
                }
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){//B
                //comprobar que sea un array
                if(!Array.isArray(principalValue.valor)){
                // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de acceso a posición de array inexistente\n';  
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se reconoce la expresion '+valor.valor+' como un index.\n';  
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }/*
                if(valor.valor>=principalValue.valor.length ||valor.valor<0){
                    consola.value+='>ERROR: No existe el elemento '+valor.valor+' en el array.\n';  
                    throw '>ERROR: No existe el elemento '+valor.valor+' en el array.\n';             
                }*/
                //comprobar que la posición no sea más larga que el length de la posición.
                principalValue = principalValue.valor[valor.valor];
            }else {
                consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';  
                throw '>ERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';
            }
            temp=temp.next_acc;
        }
        return principalValue;
    }
    //SENTENCIAS DE CONTROL 
    function procesarIf(instruccion, tablaDeSimbolos, ambito) {
        consola.value+="//comienza el if\n";
        let verdadero = nuevaEtiqueta(), falso = nuevaEtiqueta();
        const logica = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito);
        consola.value+="if("+logica.valor+")goto "+verdadero+";\ngoto "+falso+";\n";
        consola.value+=verdadero+":\n";
            const tsIf = new TS(tablaDeSimbolos.simbolos.slice(), consola);
            let returnedAcction = procesarBloque(instruccion.accion, tsIf, ambito);
            if(returnedAcction!=undefined){
                return returnedAcction;
            }
        consola.value+=falso+":\n";
        if (instruccion.else != "Epsilon") {
                if (instruccion.else.sentencia === SENTENCIAS.ELSE_IF) {
                    const tsElIf = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarIf(instruccion.else, tsElIf, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } else {
                    const tsElse = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarBloque(instruccion.else.accion, tsElse, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                }
        }    
    }
    function procesarFor(instruccion, tablaDeSimbolos, ambito) {
        let inicio =nuevaEtiqueta(), verdadero= nuevaEtiqueta(), falso = nuevaEtiqueta(), temporalID =  nuevoTemporal();
        procesarBloque([instruccion.inicial], tablaDeSimbolos, ambito);
        let instruccionID = instruccion.inicial.sentencia==SENTENCIAS.ASIGNACION?instruccion.inicial.id.id:instruccion.inicial.id;
        //asignarle el valor del ID al temporal de control
        const valor = procesarExpresionNumerica(instruccion.inicial.expresion, tablaDeSimbolos, ambito);
        tablaDeSimbolos.actualizar(instruccionID, valor);//, SplitAmbitos(ambito)
        if (instruccion.paso.paso == "++") {
            consola.value+=inicio+":\n";
            let condicion = procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito).valor;
            consola.value+="if("+condicion+") goto "+verdadero+";\ngoto "+falso+";\n";
            consola.value+=verdadero+":\n";
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                let returnedAcction =  procesarBloque(instruccion.accion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                       // break;
                    }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                      //  continue;
                    }else{
                        return returnedAcction;
                    } 
                }
            let identificador = tablaDeSimbolos.getSimbol(instruccionID,SplitAmbitos(ambito), "inFor", "inFor");
            //incremento 
            let pila=(identificador.ambito=="Global")?"heap":"stack";
            consola.value+=temporalID+"="+pila+"[(int)"+identificador.direcciones+"]+1;\n"+pila+"[(int)"+identificador.direcciones+"]="+temporalID+";\n";
            consola.value+="goto "+inicio+";\n";
            consola.value+=falso+":\n";
        } else if (instruccion.paso.paso == "--") {
            for (var i = tablaDeSimbolos.obtenerSimbolo(instruccionID, SplitAmbitos(ambito)); procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito).valor; tablaDeSimbolos.actualizar(instruccionID, { valor: Number(tablaDeSimbolos.obtenerSimbolo(instruccionID, SplitAmbitos(ambito)).valor) - 1, tipo: tablaDeSimbolos.obtenerSimbolo(instruccionID, SplitAmbitos(ambito)).tipo })) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                let returnedAcction =  procesarBloque(instruccion.accion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        break;
                    }else{
                        return returnedAcction;
                    } 
                }
            }
        } else {
            for (var i = tablaDeSimbolos.obtenerSimbolo(instruccionID, SplitAmbitos(ambito)); procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito).valor; tablaDeSimbolos.actualizar(instruccionID, { valor: Number(procesarExpresionNumerica(instruccion.paso.paso, tablaDeSimbolos, ambito).valor), tipo: tablaDeSimbolos.obtenerSimbolo(instruccionID, SplitAmbitos(ambito)).tipo })) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                let returnedAcction =  procesarBloque(instruccion.accion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        break;
                    }else{
                        return returnedAcction;
                    } 
                }
            }
    
        }
    
    }
    function procesarForOF(instruccion, tablaDeSimbolos, ambito){
        let conjunto = procesarAccID(instruccion.conjunto, tablaDeSimbolos, ambito);
        if(!Array.isArray(conjunto.valor)){
            consola.value+='>ERROR: '+conjunto.id+' no es un array.\n';  
            throw '>ERROR: '+conjunto.id+' no es un array.\n';               
        }
        tablaDeSimbolos.agregar(TIPO_VARIABLE.LET, instruccion.variable, "infer",  "undefined", ambito, "temp", "temp");
        for(let val of conjunto.valor){
            tablaDeSimbolos.actualizarAndType(instruccion.variable, val);
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
            let returnedAcction = procesarBloque(instruccion.accion, tsFor, ambito);
            if(returnedAcction!=undefined){
                if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                    break;
                }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                    continue;
                }else{
                    return returnedAcction;
                } 
            }
        }
    }
    function procesarForIn(instruccion, tablaDeSimbolos, ambito){
        let conjunto = procesarAccID(instruccion.conjunto, tablaDeSimbolos, ambito);
        if(!Array.isArray(conjunto.valor)){
            consola.value+='>ERROR: '+conjunto.id+' no es un array.\n';  
            throw '>ERROR: '+conjunto.id+' no es un array.\n';               
        }
        tablaDeSimbolos.agregar(TIPO_VARIABLE.LET, instruccion.variable, "infer",  "undefined", ambito, "temp", "temp");
        for(let val in conjunto.valor){
            tablaDeSimbolos.actualizarAndType(instruccion.variable, {valor:val, tipo:"number"});
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
            let returnedAcction = procesarBloque(instruccion.accion, tsFor, ambito);
            if(returnedAcction!=undefined){
                if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                    break;
                }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                    continue;
                }else{
                    return returnedAcction;
                } 
            }
        }
    }
    function procesarWhile(instruccion ,tablaDeSimbolos, ambito){
        let inicio = nuevaEtiqueta(), verdadero=nuevaEtiqueta(), falso= nuevaEtiqueta();
        consola.value+=inicio+": \n";
        let valor = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito);
        consola.value+="if("+valor.valor+") goto "+verdadero+";\n";
        consola.value+="goto "+falso+";\n";
        consola.value+=verdadero+":\n";
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
            let returnedAcction = procesarBloque(instruccion.accion, tsFor, ambito);
            if(returnedAcction!=undefined){
                if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                   // break;
                   consola.value+="goto "+falso+";\n";
                }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                   // continue;
                   consola.value+="goto "+inicio+";\n";
                }else{
                    return returnedAcction;  
                }
            }
        consola.value+=falso+":\n";        
    }
    function procesarDoWhile(instruccion ,tablaDeSimbolos, ambito){
        let inicio = nuevaEtiqueta(), falso = nuevaEtiqueta();
        consola.value+=inicio+":\n";
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
            let returnedAcction = procesarBloque(instruccion.accion, tsFor, ambito);
            if(returnedAcction!=undefined){
                if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                  //  break;
                  consola.value+="goto "+falso+";\n";
                }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                   // continue;
                   consola.value+="goto "+inicio+";\n";
                }else{
                    return returnedAcction;
                } 
            }
        let valor = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito);
        consola.value+="if("+valor.valor+") goto "+inicio+";\n";
        consola.value+="goto "+falso+";\n"+falso+":\n";
    }
    function procesarSwitch(instruccion, tablaDeSimbolos, ambito){
        let cases =  getCases(instruccion.cases);
        for(let i = 0;i<cases.length;i++){
            if(cases[i].logica=="default"){
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                let returnedAcction = procesarBloque(cases[i].accion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        break;
                    }else{
                        return returnedAcction;
                    } 
                } 
                break;
            }else{
                let original = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito);
                let caso= procesarExpresionNumerica(cases[i].logica, tablaDeSimbolos, ambito);
                let returnedAcction;
                if(original.valor==caso.valor){
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                    for(let e =i;e<cases.length;e++){
                        returnedAcction = procesarBloque(cases[e].accion, tsFor, ambito);
                        if(returnedAcction!=undefined){
                            if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                                break;
                            }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                                continue;
                            }else{
                                return returnedAcction;
                            } 
                        } 
                    }
                    i=cases.length; 
                    if(returnedAcction!=undefined){
                        if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                        }else{
                            return returnedAcction;
                        } 
                    }                  
                }
            }
        }
    }
    function getCases(cases){
        let arreglo = [];
        let temp=cases;
        while(temp!="Epsilon"){
            arreglo.push(temp);
            temp=temp.next_case;
            if(temp.logica=="default"){
                arreglo.push(temp);
                break;
            }
        }
        return arreglo;
    }
    //Graficar TS
    function graficar_Ts(tablaDeSimbolos, ambito){
        let tabla = document.createElement("table");
        tabla.bgColor= '#bbe1fa';
        tabla.align="center";
        tabla.width="80%";
        tabla.border="1px solid black";
        var row0 =  tabla.insertRow( tabla.rows.length);
        var celda01 = row0.insertCell(0);
        var celda02 = row0.insertCell(1);
        var celda03 = row0.insertCell(2);
        var celda04 = row0.insertCell(3);
        var celda05 = row0.insertCell(4);
        var celda06 = row0.insertCell(5);
        var celda07 = row0.insertCell(6);
        var celda08 = row0.insertCell(7);
        celda01.innerHTML = "No.";
        celda01.bgColor="#40a8c4";
        celda02.innerHTML = "Sentencia";
        celda02.bgColor="#40a8c4";
        celda03.innerHTML = "ID";
        celda03.bgColor="#40a8c4";
        celda04.innerHTML = "Tipo";
        celda04.bgColor="#40a8c4";
        celda05.innerHTML = "Valor";
        celda05.bgColor="#40a8c4";
        celda06.innerHTML = "Fila";
        celda06.bgColor="#40a8c4";
        celda07.innerHTML = "Columna";
        celda07.bgColor="#40a8c4";
        celda08.innerHTML = "Ambito";
        celda08.bgColor="#40a8c4";
      if(tablaDeSimbolos._simbolos.length!=0){
        let i=0;
        for(let simbolo of tablaDeSimbolos._simbolos) {
        if(simbolo.si=="variable"){
        i++;
          var row = tabla.insertRow( tabla.rows.length);
          var celda1 = row.insertCell(0);
          var celda2 = row.insertCell(1);
          var celda3 = row.insertCell(2);
          var celda4 = row.insertCell(3);
          var celda5 = row.insertCell(4);
          var celda6 = row.insertCell(5);
          var celda7 = row.insertCell(6);
          var celda8 = row.insertCell(7);
          celda1.innerHTML = i;
          celda2.innerHTML = simbolo.si;
          celda3.innerHTML = simbolo.id;
          celda4.innerHTML = simbolo.tipo;
          celda5.innerHTML = toString({valor:simbolo.valor,tipo:simbolo.tipo}, tablaDeSimbolos, ambito);
          celda6.innerHTML = simbolo.fila;
          celda7.innerHTML = simbolo.columna;
          celda8.innerHTML = simbolo.ambito;
        }
        }
      }
      tablero.appendChild(tabla);
    }
    function nuevoTemporal(){
        contadores.temporales++;
        return "t"+contadores.temporales;
    }
    function nuevaEtiqueta(){
        contadores.etiquetas++;
        return "L"+contadores.etiquetas;
    }
    function nuevoArreglo(dimension){
        switch(dimension){
            case 1:
                arreglos.uno++;
                return "arrayOne"+arreglos.uno;
            case 2:
                arreglos.dos++;
                return "arrayTwo"+arreglos.dos;
            case 3:
                arreglos.tres++;
                return "arrayThree"+arreglos.tres;
            case 4:
                arreglos.cuatro++;
                return "arrayFour"+arreglos.cuatro;
            case 5:
                arreglos.cinco++;
                return "arrayFive"+arreglos.cinco;
        }
    }
    function stackPush(){
        pilas.stack++;
        return pilas.stack-1;
    }
    function heapPush(){
        pilas.heap++;
        return pilas.heap-1;
    }
    function printTemporales(){
        let txt ="";
        for(let i = 0;i<=contadores.temporales;i++){
            txt+="t"+i;
            txt+=(i<contadores.temporales)?",":"";
        }
        for(let i =0;i<arreglos.uno;i++){
            txt+= ",*arrayOne"+(i+1);
        }
        for(let i =0;i<arreglos.dos;i++){
            txt+= ",**arrayTwo"+(i+1);
        }
        for(let i =0;i<arreglos.tres;i++){
            txt+= ",***arrayThree"+(i+1);
        }
        for(let i =0;i<arreglos.cuatro;i++){
            txt+= ",****arrayFour"+(i+1);
        }
        for(let i =0;i<arreglos.cinco;i++){
            txt+= ",*****arrayFive"+(i+1);
        }
        return txt+";\n";
    }
    function funcionesNativas(){
        //funcion para imprimir strings
        let text = "//t0=cadena\nvoid imprimir(){\nL0: if(heap[(int)t0]!=-1) goto L1;\ngoto L3;\nL1: if(heap[(int)t0]>300) goto L2;\nprintf(\"%c\", (char)heap[(int)t0]);\nt0=t0+1;\ngoto L0;\nL2:\nprintf(\"%f\", heap[(int)t0]-300);\nt0=t0+1;\ngoto L0;\nL3:\nreturn;\n}";
        //función para concatenar 2 strings
        text+="//t1 y t3 son el inicio de las cadenas\nvoid concatenar(){\nL0:\nif(heap[(int)t1]!=-1) goto L1;\ngoto L2;\nL1:\nt2=heap[(int)t1];\nheap[(int)h]=t2;\nh=h+1;\nt1=t1+1;\ngoto L0;\nL2: if(heap[(int)t3]!=-1) goto L3;\ngoto L4;\n";
        text+="L3:\nt2=heap[(int)t3];\nheap[(int)h]=t2;\nh=h+1;\nt3=t3+1;\ngoto L2;\nL4:\nheap[(int)h]=-1;\nh=h+1;\nreturn;\n}\n";
        //funcion para calcular el length de strings
        text+="//t4 es la cadena y t5 es el valor de retorno\nvoid getLength(){\nL0: if(t4!=-1) goto L1;\ngoto L2;\nL1: t5=t5+1;\nL2: return;\n}\n";
        //funcion para concatenar una string y un numero 
        text+="//t1=Cadena,t2,t3=numero\nvoid conStrNum(){\nL0:\nif(heap[(int)t1]!=-1) goto L1;\ngoto L2;\nL1: \nt2=heap[(int)t1];\nheap[(int)h]=t2;\nh=h+1;\nt1=t1+1;\ngoto L0;\nL2: \nheap[(int)h]=t3+300;\nh=h+1;\nheap[(int)h]=-1;\nh=h+1;\nreturn;\n}\n";
        //funcion apra concatenar un número y string
        text+="//t1=Cadena,t2,t3=numero\nvoid conNumStr(){\nL0:\nheap[(int)h]=t3+300;\nh=h+1;\nL1: if(heap[(int)t1]!=-1) goto L2;\ngoto L3;\nL2:\n t2=heap[(int)t1];\nheap[(int)h]=t2;\nh=h+1;\nt1=t1+1;\ngoto L1;\nL3:\nheap[(int)h]=-1;\nh=h+1;\n\nreturn;\n}\n";
        return text;
    }
    function declararArregloC3D(arreglo){
        let tipo ="", arrayName="";
        for(let i =0; i<arreglo.tipo.split("[]").length-1;i++){
            tipo+=arreglo.tipo.split("[]")[i];
        }
        switch(arreglo.tipo.split("[]").length){
            case 1: 
                return;
            case 2:
                arrayName = nuevoArreglo(1);
                consola.value+=arrayName+"="+"(float *)malloc("+arreglo.direcciones.length+"*sizeof(float));\n";
                for(let i =0;i<arreglo.direcciones.length;i++){
                    consola.value+=arrayName+"["+i+"]="+arreglo.direcciones[i]+";\n";
                }
                //declarar los arreglos con los elemntos de la dimensión
                arreglo.direcciones=arrayName;
                return arrayName;
            case 3:
                arrayName = nuevoArreglo(2);
                consola.value+=arrayName+"="+"(float *)malloc("+arreglo.direcciones.length+"*sizeof(float));\n";
                for(let i =0;i<arreglo.direcciones.length;i++){
                    declararArregloC3D({direcciones:arreglo.direcciones[i], tipo:tipo});
                    consola.value+=arrayName+"["+i+"]="+arreglo.direcciones[i]+";\n";
                }
                //declarar los arreglos con los elemntos de la dimensión
                return arrayName;
            case 4:
                arrayName = nuevoArreglo(3);
                consola.value+=arrayName+"="+"(float *)malloc("+arreglo.direcciones.length+"*sizeof(float));\n";
                for(let i =0;i<arreglo.direcciones.length;i++){
                    declararArregloC3D({direcciones:arreglo.direcciones[i], tipo:tipo});
                    consola.value+=arrayName+"["+i+"]="+arreglo.direcciones[i]+";\n";
                }
                //declarar los arreglos con los elemntos de la dimensión
                return arrayName;
            case 5:
                arrayName = nuevoArreglo(4);
                consola.value+=arrayName+"="+"(float *)malloc("+arreglo.direcciones.length+"*sizeof(float));\n";        
                for(let i =0;i<arreglo.direcciones.length;i++){
                    declararArregloC3D({direcciones:arreglo.direcciones[i], tipo:tipo});
                    consola.value+=arrayName+"["+i+"]="+arreglo.direcciones[i]+";\n";
                }
                //declarar los arreglos con los elemntos de la dimensión
                return arrayName;
        }
    }
}