if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', InicializarProductos);
} else {
    InicializarProductos()
}

let productos;
let productosSeleccionados = [];


class Producto {
   constructor(nombre,precio,logo,stock){
       this.Nombre = nombre;
       this.Precio = precio;
       this.Logo = logo;
       this.Stock = stock;
   }
}

class ProductoSeleccionado{
    constructor(producto,cantidad){
        this.Producto = producto;
        this.Cantidad = cantidad;
    }
}



function InicializarProductos() {
    
    if(!productos){
        fetch("datos.json")
        .then((res) => res.json())
        .then((data) =>{
            console.log(data);
            productos = data;
            initProducts();
        });
        
    }
    else{
        initProducts();
    }
}

function initProducts()
{
        let shop = document.getElementsByClassName("shop-items");
        shop[0].innerHTML = '';

        productos.forEach( p => {
            let prod = `<div class="shop-item"><span class="shop-item-marca">` + p.Nombre + `</span>
            <img class="shop-item-imagen" src="`+ p.Logo +`">
            <div class="shop-item-detalles">
                <span class="shop-item-precio"><strong>Stock:</strong>`+ p.Stock +`</span>
                <span class="shop-item-precio"><strong>Precio: $</strong>`+ p.Precio+`</span>
                <div class="btnAdd"><button id="btnAdd${p.Nombre}" ${ p.Stock == 0? 'disabled':'' } class="btn btn-primary shop-item-button" type="button" onclick="AddItem(${ productos.indexOf(p) })">Agregar</button></div>
            </div>
            </div>`;

            shop[0].innerHTML += prod;
        });
}

function AddItem(productPosition)
{   
    prod = productos[productPosition];
    console.log("Agregar Producto:");
    console.log(prod);
    selectedProd = new ProductoSeleccionado(prod,1);
    console.log("ProductoSeleccionado:");
    console.log(selectedProd);
    
    if(productosSeleccionados.find(p => p.Producto.Nombre == prod.Nombre))
    {
        alert('El producto ya se encuentra agregado');
        return;
    }

    productosSeleccionados.push(selectedProd);
    ActualizarCarrito(selectedProd);
    console.log("Productos Seleccionados:");
    console.log(productosSeleccionados);

    ValidarBotonComprar();
    ActualizarTotal();
}

function IncrementarItem(cantidad,nombreProducto)
{   
    selectedProd = productosSeleccionados.find(p => p.Producto.Nombre == nombreProducto);

    if(selectedProd.Producto.Stock >= cantidad && cantidad > 0)
    {
        selectedProd.Cantidad = cantidad;

    }
    else{
        alert('No hay ese stock disponible');
        selectedProd.Cantidad = selectedProd.Cantidad;
    }
   
    ActualizarCarrito();
    ActualizarTotal();
}

function RemoveItemFromCart(nombreProducto)
{
    selectedProd = productosSeleccionados.find(p => p.Producto.Nombre == nombreProducto);
    console.log("Eliminar Producto:");
    console.log(prod);
    console.log("Productos Seleccionados:");
    console.log(productosSeleccionados);
    let indexOfProduct = productosSeleccionados.indexOf(selectedProd);
    console.log('INDEX OF '+ nombreProducto + " " + indexOfProduct );
    productosSeleccionados.splice(indexOfProduct,1);
    console.log("Productos Seleccionados:");
    console.log(productosSeleccionados);
    ActualizarCarrito();
    ActualizarTotal();
    if(productosSeleccionados.length == 0){
        ValidarBotonComprar();
    }
}

function ActualizarTotal()
{
    let total = document.getElementById("total");
    console.log("Productos Seleccionados:");
    console.log(productosSeleccionados);
    let totalAmount = 0;
    productosSeleccionados.forEach(ps =>{
        totalAmount += ps.Producto.Precio * ps.Cantidad; 
        console.log("TotalAmount:");
        console.log(totalAmount);
    });

    total.innerText = totalAmount;
    
}

function Comprar()
{
    console.log("COMPRAR");
    ActualizarStock();
    VaciarCarrito();
    InicializarProductos();
    ActualizarTotal();
    Swal.fire({
        title: 'Completada',
        text: 'Gracias por su compra',
        icon: 'success',
    })   
}

function ActualizarStock()
{
    console.log('Actualizando Stock');
    productosSeleccionados.forEach( itemCart => {
        selectedProd = productos.find(p => p.Nombre == itemCart.Producto.Nombre);
        selectedProd.Stock = selectedProd.Stock - itemCart.Cantidad;
    });
}

function VaciarCarrito()
{
    productosSeleccionados = [];
    ActualizarCarrito();
    ValidarBotonComprar();
}

function ValidarBotonComprar()
{
    btnComprar = document.getElementById("btnComprar");
    btnComprar.disabled = productosSeleccionados.length == 0;

}


function ActualizarCarrito() {
    //LIMPIAR EL HTML DEL CARRITO
    let cart = document.getElementsByClassName("cart-items")[0];
    cart.innerHTML = "";

    productosSeleccionados.forEach( itemCart => {
        
    
    let cartItem = `
        <div class="cart-row">
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${itemCart.Producto.Logo}" width="100" height="100">
            <span class="cart-item-marca">${itemCart.Producto.Nombre}</span>
        </div>
        <span class="cart-precio cart-column">$${itemCart.Producto.Precio * itemCart.Cantidad}</span>
        <div class="cart-cantidad cart-column">
            <input class="cart-cantidad-input" type="number" value="${itemCart.Cantidad}" onchange="IncrementarItem(this.value,'${itemCart.Producto.Nombre}')">
            <button class="btn btn-danger" type="button" onclick="RemoveItemFromCart('${itemCart.Producto.Nombre}')">ELIMINAR</button>
        </div>
        </div>`;

    cart.innerHTML += cartItem
   
    });
}


