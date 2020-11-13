
export default function Optimizar(consola, printedTable, tablero){
    let codigo = consola.value.split("\n");
    try {
        aplicarReglas();
        let text ="";
        for(let line of codigo){
            if(line!=""){
                text+=line+"\n";
            }
        }
        consola.value=text;
    } catch (e) {
        console.error(e);
        return;
    }
    function aplicarReglas(){        
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//)==null && codigo[line]!=""){
                let stack = String(codigo[line]).match(/stack/);
                let heap = String(codigo[line]).match(/heap/);
                let te = String(codigo[line]).match(/goto(\s)+L(\d)+;/g);
                if(stack==null && heap == null){//operaciones entre temporales
                    if(String(codigo[line]).match(/\+(\s)*0(\s)*;/g)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:6, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\+(\s)*0/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/\+0/g,'');
                        }
                    }else if(String(codigo[line]).match(/=(\s)*0(\s)*\+/g)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:6, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/0(\s)*\+/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/0(\s)*\+/g,'');
                        }
                    }else if(String(codigo[line]).match(/-(\s)*0(\s)*;/g)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:7, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:11, eliminado:codigo[line], agregado:String(codigo[line]).replace(/-(\s)*0/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/-(\s)*0/g,'');
                        }
                    }else if(String(codigo[line]).match(/\*(\s)*1(\s)*;/g)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:8, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\*(\s)*1/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/\*1/g,'');
                        }
                    }else if(String(codigo[line]).match(/=(\s)*1(\s)*\*/g)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:8, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/1(\s)*\*/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/1(\s)*\*/g,'');
                        }
                    }else  if(String(codigo[line]).match(/\/(\s)*1(\s)*;/g)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:9, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:13, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\/(\s)*1/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/\/(\s)*1/g,'');
                        }
                    }else if(String(codigo[line]).match(/\*(\s)*2(\s)*;/g)!=null){
                        let derecho = codigo[line].split("=")[1];
                        let repetir = derecho.split("*")[0];
                        printedTable.opt.push({regla:14, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\*(\s)*2(\s)*;/g, '+'+repetir+';'), fila:line});
                        codigo[line]= String(codigo[line]).replace(/\*(\s)*2(\s)*;/g, '+'+repetir+';');
                        codigo[line]= String(codigo[line]).replace(/\s/g, '');
                    }else if(String(codigo[line]).match(/=(\s)*2(\s)*\*/g)!=null){
                        let derecho = codigo[line].split("=")[1];
                        let repetir = derecho.split("*")[1];
                        repetir = repetir.split(";")[0];
                        printedTable.opt.push({regla:14, eliminado:codigo[line], agregado:String(codigo[line]).replace(/=(\s)*2(\s)*\*/g, '='+repetir+'+'), fila:line});
                        codigo[line]= String(codigo[line]).replace(/=(\s)*2(\s)*\*/g, '='+repetir+'+');   
                        codigo[line]= String(codigo[line]).replace(/\s/g, '');  
                    }else if(String(codigo[line]).match(/\*(\s)*0(\s)*;/g)!=null){
                        printedTable.opt.push({regla:15, eliminado:codigo[line], agregado:String(codigo[line]).replace(/=[^\*]+\*(\s)*0(\s)*;/g,'=0;'), fila:line});
                        codigo[line]=String(codigo[line]).replace(/=[^\*]+\*(\s)*0(\s)*;/g,'=0;');
                    }else if(String(codigo[line]).match(/=(\s)*0(\s)*\*/g)!=null){
                        printedTable.opt.push({regla:15, eliminado:codigo[line], agregado:String(codigo[line]).replace(/=(\s)*0(\s)*\*[^\*]+;/g,'=0;'), fila:line});
                        codigo[line]=String(codigo[line]).replace(/=(\s)*0(\s)*\*[^\*]+;/g,'=0;');
                    }else if(String(codigo[line]).match(/goto(\s)+L(\d)+(\s)*;/g)!=null && String(codigo[line]).match(/if/g)==null){//solo agarre los goto sin if
                        let salto = nextLabel(line, String(codigo[line]).match(/L(\d)+/g)[0]);
                        if(salto!=-1){
                            if(Number(line)!=salto-1){
                                for(let i =Number(line)+1;i<salto;i++){
                                    codigo[i]="";
                                }
                                printedTable.opt.push({regla:1, eliminado:"codigo eliminado de la línea "+(Number(line)+1)+" hasta "+(salto)+".", agregado:'', fila:line});
                            }
                        }                    
                    }else if(String(codigo[line]).match(/if/g)!=null && String(codigo[line]).match(/(<|<=|>|>=|!=|==)/g)!=null && String(codigo[line]).match(/goto(\s)*L(\d)+/g)!=null){//un if con rel y goto
                        if(String(codigo[line]).match(/\((\s)*\d+(\s)*(<|<=|>|>=|!=|==)(\s)*\d+(\s)*\)/g)!=null){//rel entre constantes
                            if(String(codigo[Number(line)+1]).match(/goto(\s)+L(\d)+/g)!=null){//nextLine is goto
                                let valIzq, valDer, op;
                                valIzq=String(codigo[line]).match(/\((\s)*\d+/g)[0];
                                valIzq=String(valIzq).replace(/\(/, '');
                                valDer=String(codigo[line]).match(/\d+(\s)*\)/g)[0];
                                valDer=String(valDer).replace(/\)/, '');
                                op= String(codigo[line]).match(/(<|<=|>|>=|!=|==)/)[0];
                                let result;
                                switch(op){
                                    case '<':
                                        result = Number(valIzq)<Number(valDer);
                                        break;
                                    case '<=':
                                        result = Number(valIzq)<=Number(valDer);
                                        break;
                                    case '>':
                                        result = Number(valIzq)>Number(valDer);
                                        break;
                                    case '>=':
                                        result = Number(valIzq)>=Number(valDer);
                                        break;
                                    case '!=':
                                        result = Number(valIzq)!=Number(valDer);
                                        break;
                                    case '==':
                                        result = Number(valIzq)==Number(valDer);
                                        break;
                                }
                                if(result){
                                    printedTable.opt.push({regla:3, eliminado:codigo[Number(line)+1], agregado:'', fila:line});
                                    codigo[Number(line)+1]="";
                                }else{
                                    printedTable.opt.push({regla:4, eliminado:codigo[Number(line)], agregado:'', fila:line});
                                    codigo[Number(line)]="";
                                }
                            }
                        }
                    }else if(String(codigo[line]).match(/=(\s)*0(\s)*\//g)!=null){
                        printedTable.opt.push({regla:16, eliminado:codigo[line], agregado:codigo[line].split("=")[0]+"=0;", fila:line});
                        codigo[line]= String(codigo[line]).replace(codigo[line].split("=")[1], '0;');   
                    }
                }else{
                    if(String(codigo[line]).match(/\+(\s)*0(\s)*;/g)!=null){
                        printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\+(\s)*0/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/\+(\s)*0/g,'');
                    }else if(String(codigo[line]).match(/=(\s)*0(\s)*\+/g)!=null){
                        printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/0(\s)*\+/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/0(\s)*\+/g,'');
                    }else if(String(codigo[line]).match(/-(\s)*0(\s)*;/g)!=null){  
                        printedTable.opt.push({regla:11, eliminado:codigo[line], agregado:String(codigo[line]).replace(/-(\s)*0/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/-(\s)*0/g,'');
                    }else if(String(codigo[line]).match(/\*(\s)*1(\s)*;/g)!=null){  
                        printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\*(\s)*1/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/\*(\s)*1/g,'');
                    }else if(String(codigo[line]).match(/=(\s)*1(\s)*\*/g)!=null){
                        printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/1(\s)*\*/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/1(\s)*\*/g,'');
                    }else if(String(codigo[line]).match(/\/(\s)*1(\s)*;/g)!=null){  
                        printedTable.opt.push({regla:13, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\/(\s)*1/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/\/(\s)*1/g,'');
                    }else if(String(codigo[line]).match(/\*(\s)*2(\s)*;/g)!=null){
                        let derecho = codigo[line].split("=")[1];
                        let repetir = derecho.split("*")[0];
                        printedTable.opt.push({regla:14, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\*(\s)*2(\s)*;/g, '+'+repetir+';'), fila:line});
                        codigo[line]= String(codigo[line]).replace(/\*(\s)*2(\s)*;/g, '+'+repetir+';');  
                        codigo[line]= String(codigo[line]).replace(/\s/g, '');   
                    }else if(String(codigo[line]).match(/=(\s)*2(\s)*\*/g)!=null){
                        let derecho = codigo[line].split("=")[1];
                        let repetir = derecho.split("*")[1];
                        repetir = repetir.split(";")[0];
                        printedTable.opt.push({regla:14, eliminado:codigo[line], agregado:String(codigo[line]).replace(/=(\s)*2(\s)*\*/g, '='+repetir+'+'), fila:line});
                        codigo[line]= String(codigo[line]).replace(/=(\s)*2(\s)*\*/g, '='+repetir+'+'); 
                        codigo[line]= String(codigo[line]).replace(/\s/g, '');  
                    }else if(String(codigo[line]).match(/\*(\s)*0(\s)*;/g)!=null){
                        printedTable.opt.push({regla:15, eliminado:codigo[line], agregado:String(codigo[line]).replace(/=[^\*]\*(\s)*0(\s)*;/g,'=0;'), fila:line});
                        codigo[line]=String(codigo[line]).replace(/=[^\*]\*(\s)*0(\s)*;/g,'=0;');
                    }else if(String(codigo[line]).match(/=(\s)*0(\s)*\*/g)!=null){
                        printedTable.opt.push({regla:15, eliminado:codigo[line], agregado:String(codigo[line]).replace(/=(\s)*0(\s)*\*[^\*]+;/g,'=0;'), fila:line});
                        codigo[line]=String(codigo[line]).replace(/=(\s)*0(\s)*\*[^\*]+;/g,'=0;');
                    }else if(String(codigo[line]).match(/goto(\s)+L(\d)+(\s)*;/g)!=null && String(codigo[line]).match(/if/g)==null){//solo agarre los goto sin if
                        let salto = nextLabel(line, String(codigo[line]).match(/L(\d)+/g)[0]);
                        if(salto!=-1){
                            if(Number(line)!=salto-1){
                                for(let i =Number(line)+1;i<salto;i++){
                                    codigo[i]="";
                                }
                                printedTable.opt.push({regla:1, eliminado:"codigo eliminado de la línea "+(Number(line)+1)+" hasta "+(salto)+".", agregado:'', fila:line});
                            }
                        }                    
                    }else if(String(codigo[line]).match(/if/g)!=null && String(codigo[line]).match(/(<|<=|>|>=|!=|==)/g)!=null && String(codigo[line]).match(/goto(\s)*L(\d)+/g)!=null){//un if con rel y goto
                        if(String(codigo[line]).match(/\((\s)*\d+(\s)*(<|<=|>|>=|!=|==)(\s)*\d+(\s)*\)/g)!=null){//rel entre constantes
                            if(String(codigo[Number(line)+1]).match(/goto(\s)+L(\d)+/g)!=null){//nextLine is goto
                                let valIzq, valDer, op;
                                valIzq=String(codigo[line]).match(/\((\s)*\d+/g)[0];
                                valIzq=String(valIzq).replace(/\(/, '');
                                valDer=String(codigo[line]).match(/\d+(\s)*\)/g)[0];
                                valDer=String(valDer).replace(/\)/, '');
                                op= String(codigo[line]).match(/(<|<=|>|>=|!=|==)/)[0];
                                let result;
                                switch(op){
                                    case '<':
                                        result = Number(valIzq)<Number(valDer);
                                        break;
                                    case '<=':
                                        result = Number(valIzq)<=Number(valDer);
                                        break;
                                    case '>':
                                        result = Number(valIzq)>Number(valDer);
                                        break;
                                    case '>=':
                                        result = Number(valIzq)>=Number(valDer);
                                        break;
                                    case '!=':
                                        result = Number(valIzq)!=Number(valDer);
                                        break;
                                    case '==':
                                        result = Number(valIzq)==Number(valDer);
                                        break;
                                }
                                if(result){
                                    printedTable.opt.push({regla:3, eliminado:codigo[Number(line)+1], agregado:'', fila:line});
                                    codigo[Number(line)+1]="";
                                }else{
                                    printedTable.opt.push({regla:4, eliminado:codigo[Number(line)], agregado:'', fila:line});
                                    codigo[Number(line)]="";
                                }
                            }
                        }
                    }else if(String(codigo[line]).match(/=(\s)*0(\s)*\//g)!=null){
                        printedTable.opt.push({regla:16, eliminado:codigo[line], agregado:codigo[line].split("=")[0]+"=0;", fila:line});
                        codigo[line]= String(codigo[line]).replace(codigo[line].split("=")[1], '0;');   
                    }
                }
            }
        }
    }
    function regla6_10(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//)==null){
                let stack = String(codigo[line]).match(/stack/);
                let heap = String(codigo[line]).match(/heap/);
                if(stack==null && heap == null){//operaciones entre temporales
                    if(String(codigo[line]).match(/\+(\s)*0(\s)*;/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:6, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\+(\s)*0/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/\+0/g,'');
                        }
                    }else if(String(codigo[line]).match(/=(\s)*0(\s)*\+/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:6, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/0(\s)*\+/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/0(\s)*\+/g,'');
                        }
                    }
                }else{
                    if(String(codigo[line]).match(/\+(\s)*0(\s)*;/)!=null){
                        printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\+(\s)*0/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/\+(\s)*0/g,'');
                    }else if(String(codigo[line]).match(/=(\s)*0(\s)*\+/)!=null){
                        printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/0(\s)*\+/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/0(\s)*\+/g,'');
                    }
                }
                
            }            
        }
    }
    function regla7_11(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//)==null){
                let stack = String(codigo[line]).match(/stack/);
                let heap = String(codigo[line]).match(/heap/);
                if(stack==null && heap == null){//operaciones entre temporales
                    if(String(codigo[line]).match(/-(\s)*0(\s)*;/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:7, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:11, eliminado:codigo[line], agregado:String(codigo[line]).replace(/-(\s)*0/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/-(\s)*0/g,'');
                        }
                    }
                }else{
                    if(String(codigo[line]).match(/-(\s)*0(\s)*;/)!=null){  
                        printedTable.opt.push({regla:11, eliminado:codigo[line], agregado:String(codigo[line]).replace(/-(\s)*0/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/-(\s)*0/g,'');
                    }
                }
                
            }            
        }
    }
    function regla8_12(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//)==null){
                let stack = String(codigo[line]).match(/stack/);
                let heap = String(codigo[line]).match(/heap/);
                if(stack==null && heap == null){//operaciones entre temporales
                    if(String(codigo[line]).match(/\*(\s)*1(\s)*;/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:8, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\*(\s)*1/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/\*1/g,'');
                        }
                    }else if(String(codigo[line]).match(/=(\s)*1(\s)*\*/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:8, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/1(\s)*\*/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/1(\s)*\*/g,'');
                        }
                    }
                }else{
                    if(String(codigo[line]).match(/\*(\s)*1(\s)*;/)!=null){  
                        printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\*(\s)*1/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/\*(\s)*1/g,'');
                    }else if(String(codigo[line]).match(/=(\s)*1(\s)*\*/)!=null){
                        printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/1(\s)*\*/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/1(\s)*\*/g,'');
                    }
                }
                
            }            
        }
    }    
    function regla9_13(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//)==null){
                let stack = String(codigo[line]).match(/stack/);
                let heap = String(codigo[line]).match(/heap/);
                if(stack==null && heap == null){//operaciones entre temporales
                    if(String(codigo[line]).match(/\/(\s)*1(\s)*;/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:9, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:13, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\/(\s)*1/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/\/(\s)*1/g,'');
                        }
                    }
                }else{
                    if(String(codigo[line]).match(/\/(\s)*1(\s)*;/)!=null){  
                        printedTable.opt.push({regla:13, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\/(\s)*1/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/\/(\s)*1/g,'');
                    }
                }
                
            }            
        }
    }    
    function regla15(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//)==null){
                    if(String(codigo[line]).match(/\*(\s)*0(\s)*;/)!=null){
                        printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/=[^\*]\*(\s)*0(\s)*;/g,'=0;'), fila:line});
                        codigo[line]=String(codigo[line]).replace(/=[^\*]\*(\s)*0(\s)*;/g,'=0;');
                    }else if(String(codigo[line]).match(/=(\s)*0(\s)*\*/g,'=0;')!=null){
                        printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/=(\s)*0(\s)*\*[^\*];/g,'=0;'), fila:line});
                        codigo[line]=String(codigo[line]).replace(/=(\s)*0(\s)*\*[^\*];/g,'=0;');
                    }
            }            
        }
    }  
    function regla14(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//)==null){
                if(String(codigo[line]).match(/=(\s)*0(\s)*\*/g,'=0;')!=null){
                    printedTable.opt.push({regla:15, eliminado:codigo[line], agregado:String(codigo[line]).replace(/=(\s)*0(\s)*\*[^\*]+;/g,'=0;'), fila:line});
                    codigo[line]=String(codigo[line]).replace(/=(\s)*0(\s)*\*[^\*]+;/g,'=0;');
                }
            }
        }
    }
    function regla6_10(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//)==null){
                if(String(codigo[line]).match(/=(\s)*0(\s)*\//g,'=0;')!=null){
                    printedTable.opt.push({regla:15, eliminado:codigo[line], agregado:String(codigo[line]).replace(/=(\s)*0(\s)*\*[^\*]+;/g,'=0;'), fila:line});
                    codigo[line]=String(codigo[line]).replace(/=(\s)*0(\s)*\/[^;]+;/g,'=0;');
                }
            }
        }
    }
    function regla1(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//g)==null){
                if(String(codigo[line]).match(/goto(\s)*L(\d)+(\s)*;/)!=null && String(codigo[line]).match(/if/)==null){//solo agarre los goto sin if
                    let salto = nextLabel(line, String(codigo[line]).match(/L(\d)+/))[0];
                    if(salto!=-1){
                        for(let i =line;i<=salto;i++){
                            codigo[i]="";
                        }
                        printedTable.opt.push({regla:1, eliminado:"codigo eliminado de la línea "+line+" hasta "+salto+".", agregado:'', fila:line});
                    }                    
                }
            }
        }
    }
    function nextLabel(posicion, label){
        for(let i = posicion;i<codigo.length;i++){
            if(String(codigo[i]).match(/L(\d)+(\s)*:/g)!=null){
                if(label==String(codigo[i]).match(/L(\d)+/g)[0]){
                    return i;
                }else{
                    return -1;
                }
            }else if(String(codigo[i]).match(/return/g)!=null){
                return -1;
            }else if(String(codigo[i]).match(/if/g)!=null){
                return -1;
            }else if(String(codigo[i]).match(/}/g)!=null){
                return -1
            }else if(i==codigo.length-1){
                return -1;
            }
        }
    }
    function nextLabels(posicion, Vtrue, Vfalse){
        let flag = false;
        for(let i = posicion;i<codigo.length;i++){
            if(String(codigo[i]).match(/L(\d)+(\s)*:/g)!=null){
                if(!flag){
                    if(Vtrue==String(codigo[i]).match(/L(\d)+/g)[0]){
                        flag = true;
                    }
                }else{

                }
            }else if(String(codigo[i]).match(/return/g)!=null){
                return -1;
            }else if(String(codigo[i]).match(/if/g)!=null){
                return -1;
            }
        }
    }
    function regla3_4(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//g)==null){
                if(String(codigo[line]).match(/if/g)!=null && String(codigo[line]).match(/(<|<=|>|>=|!=|==)/g)!=null && String(codigo[line]).match(/goto(\s)*L(\d)+/g)!=null){//un if con rel y goto
                    if(String(codigo[line]).match(/\((\s)*\d+(\s)*(<|<=|>|>=|!=|==)(\s)*\d+(\s)*\)/g)!=null){//rel entre constantes
                        if(String(codigo[Number(line)+1]).match(/goto(\s)+L(\d)+/g)!=null){//nextLine is goto
                            let valIzq, valDer, op;
                            valIzq=String(codigo[line]).match(/\((\s)*\d+/g)[0];
                            valIzq=String(valIzq).replace(/\(/, '');
                            valDer=String(codigo[line]).match(/\d+(\s)*\)/g)[0];
                            valDer=String(valDer).replace(/\)/, '');
                            op= String(codigo[line]).match(/(<|<=|>|>=|!=|==)/)[0];
                            let result;
                            switch(op){
                                case '<':
                                    result = Number(valIzq)<Number(valDer);
                                    break;
                                case '<=':
                                    result = Number(valIzq)<=Number(valDer);
                                    break;
                                case '>':
                                    result = Number(valIzq)>Number(valDer);
                                    break;
                                case '>=':
                                    result = Number(valIzq)>=Number(valDer);
                                    break;
                                case '!=':
                                    result = Number(valIzq)!=Number(valDer);
                                    break;
                                case '==':
                                    result = Number(valIzq)==Number(valDer);
                                    break;
                            }
                            if(result){
                                printedTable.opt.push({regla:3, eliminado:codigo[Number(line)+1], agregado:'', fila:line});
                                codigo[Number(line)+1]="";
                            }else{
                                printedTable.opt.push({regla:4, eliminado:codigo[Number(line)], agregado:'', fila:line});
                                codigo[Number(line)]="";
                            }
                        }
                    }
                }
            }
        }  
    }
    function regla_16(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//g)==null){
                if(String(codigo[line]).match(/=(\s)*0(\s)*\/;/g)!=null){
                    printedTable.opt.push({regla:14, eliminado:codigo[line], agregado:codigo[line].split("=")[0]+"=0;", fila:line});
                    codigo[line]= String(codigo[line]).replace(codigo[line].split("=")[1], '=0;');   
                }
            }
        }        
    }
}