
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
            if(String(codigo[line]).match(/\/\//)==null){
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
            }
        }
    }
}