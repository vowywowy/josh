document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.toggle-click').forEach((toggleClick) => {
		toggleClick.addEventListener('click', () => {
			toggleClick.parentNode.querySelector('.toggle-show').style.display = 'flex';
			document.addEventListener('click', (ev) => {
				if (toggleClick) {
					if (!ev.path.includes(toggleClick)
						&&
						!ev.path.includes(toggleClick.parentNode.querySelector('.toggle-show'))
						||
						ev.path.includes(toggleClick.parentNode.querySelector('.to-cart'))
					) {
						toggleClick.parentNode.querySelector('.toggle-show').style.display = 'none';
					}
				}
			});
		});
	});

	document.querySelectorAll('.cart-q').forEach(iq => {
		iq.addEventListener('change', () => {
			!(iq.value > 0)
				? iq.parentNode.querySelector('.to-cart').setAttribute('disabled', 'disabled')
				: iq.parentNode.querySelector('.to-cart').removeAttribute('disabled');
			if (document.querySelector('.services-selector').value == '') {
				iq.parentNode.querySelector('.to-cart').setAttribute('disabled', 'disabled');
			}
		});
	});

	let cart = [];
	let cartId = -1;
	document.querySelectorAll('.to-cart').forEach(toCart => {
		toCart.addEventListener('click', () => {
			if (toCart.getAttribute('disabled') != 'disabled') {
				cart.push({
					quantity: toCart.parentNode.querySelector('.cart-q').value,
					title: toCart.parentNode.parentNode.parentNode.querySelector('.cart-t').textContent || toCart.parentNode.parentNode.parentNode.querySelector('.cart-t').value,
					price: toCart.parentNode.parentNode.querySelector('.cart-p').textContent || toCart.parentNode.parentNode.querySelector('.cart-p').value,
					id: cartId +=1
				});
				document.querySelectorAll('.cart-visible tr:not(.cart-header)').forEach(tr => {
					tr.remove();
				});
				let cartTotal = 0;
				cart.forEach(item => {
					const itemRow = document.createElement('tr');
					const itemDelete = document.createElement('td');

					itemDelete.textContent = '✖';
					itemDelete.setAttribute('class','cart-delete');

					itemRow.setAttribute('id',`cart-id-${item.id}`);
					itemRow.appendChild(itemDelete);
					Object.keys(item).forEach(key => {
						if(key != 'id'){
							let itemData = document.createElement('td');
							itemData.setAttribute('class', `cart-${key}`);
							itemData.textContent = item[key];
							itemRow.appendChild(itemData);
						}
					});
					document.querySelector('.cart-visible').appendChild(itemRow);
					cartTotal += Number(item.price);
					if (cart.length > 0) {
						document.querySelector('.checkout-submit').removeAttribute('disabled');
					}
				});
				document.querySelector('.cart-total').textContent = Number(cartTotal).toFixed(2);
				if (document.querySelector('.cart-button').classList.contains('pulse')) {
					document.querySelector('.cart-button').style.animation = 'none';
					setTimeout(()=>{
						document.querySelector('.cart-button').style.animation = '';
					}, 10);
				} else {
					document.querySelector('.cart-button').classList.add('pulse');
				}

				document.querySelectorAll('.cart-delete').forEach(cartDelete => {
					cartDelete.addEventListener('click', () => {
						const item = cart.find((toDelete)=>toDelete.id == cartDelete.parentNode.id.split('-').slice(-1)[0]);
						const index = cart.indexOf(item);
						if(index > -1){
							cart.splice(index, 1);
						}
						cartDelete.parentNode.remove();
						let cartTotal = 0;
						cart.forEach(item => {
							cartTotal += Number(item.price);
						});
						document.querySelector('.cart-total').textContent = Number(cartTotal).toFixed(2);

						if(!(cart.length > 0)){
							document.querySelector('.checkout-submit').setAttribute('disabled', 'disabled');
						}
					});
				});
			}
		});
	});

	document.querySelector('.paypal').addEventListener('submit',(e)=>{
		console.log(e);
		e.preventDefault();
		cart.forEach((item, index)=>{
			Object.keys(item).forEach(key=>{
				if(key != 'id'){
					const paypalInput = document.createElement('input');
					paypalInput.setAttribute('type', 'hidden');
					paypalInput.setAttribute('value', item[key]);
					switch(key){
						case 'title':
							paypalInput.setAttribute('name', `item_name_${index+1}`);
							break;
						case 'quantity':
							paypalInput.setAttribute('name', `quantity_${index + 1}`);
							break;
						case 'price':
							paypalInput.setAttribute('name', `amount_${index+1}`);
							break;
					}
					e.target.appendChild(paypalInput);
				}
			});
		});
		e.target.submit();
	}, {once: true});

	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'purchasables.json', true);
	xhr.send();
	xhr.addEventListener('load',()=>{
		let purchasables = JSON.parse(xhr.response);
		purchasables.products.forEach((product, index)=>{
			let itemContainer 			= document.createElement('div');
			let itemTitle				= document.createElement('div');
			let itemImage				= document.createElement('div');
			let itemControls			= document.createElement('div');
			let itemAdd					= document.createElement('input');
			let itemQuantityContainer 	= document.createElement('div');
			let label 					= document.createElement('label');
			let itemQuantity 			= document.createElement('input');
			let itemSave 				= document.createElement('input');
			let itemPrice 				= document.createElement('div');

			itemContainer.setAttribute('class','item-container');
			itemContainer.setAttribute('id', `item-${index+1}`);
			
			itemTitle.setAttribute('class','item-title cart-t');
			itemTitle.setAttribute('title', product.title);
			itemTitle.textContent = product.title;
			
			itemImage.setAttribute('class','item-image');
			itemImage.style.backgroundImage = `url(${product.image})`;
					
			itemControls.setAttribute('class', 'item-controls');
						
			itemAdd.setAttribute('class', 'item-add toggle-click');
			itemAdd.setAttribute('type', 'button');
			itemAdd.setAttribute('value', 'Add');
						
			itemQuantityContainer.setAttribute('class','item-quantity-container');

			label.textContent = 'Qty';
						
			itemQuantity.setAttribute('class', 'item-quantity cart-q');
			itemQuantity.setAttribute('type', 'number');
			itemQuantity.setAttribute('value', '1');
			itemQuantity.setAttribute('min', '1');
						
			itemSave.setAttribute('class', 'item-save to-cart');
			itemSave.setAttribute('type', 'button');
			itemSave.setAttribute('value', 'Save');
						
			itemPrice.setAttribute('class', 'item-price cart-p');
			itemPrice.textContent = product.price;

			itemQuantityContainer.appendChild(label);
			itemQuantityContainer.appendChild(itemQuantity);
			itemQuantityContainer.appendChild(itemSave);

			itemControls.appendChild(itemAdd);
			itemControls.appendChild(itemQuantityContainer);
			itemControls.appendChild(itemPrice);

			itemContainer.appendChild(itemTitle);
			itemContainer.appendChild(itemImage);
			itemContainer.appendChild(itemControls);

			document.querySelector('.products').appendChild(itemContainer);
		});
		purchasables.services.forEach(service=>{
			let serviceOption = document.createElement('option');
			serviceOption.setAttribute('value', service.title);
			serviceOption.textContent = service.title;

			document.querySelector('.services-selector').appendChild(serviceOption);
		});
		document.querySelector('.services-selector').addEventListener('change', (change) => {
			change.target.parentNode.parentNode.querySelector('.cart-t').value = change.target.value;
			if (change.target.value != '' && document.querySelector('.services-quantity').value > 0) {
				change.target.parentNode.querySelector('.to-cart').removeAttribute('disabled');
			}

			let selectedService = purchasables.services.find(selected=>selected.title == change.target.value);
			document.querySelector('.services-image').style.backgroundImage = `url(${selectedService.image})`;
			document.querySelector('.services-description').textContent = selectedService.description;
			document.querySelector('.services-selection .cart-p').setAttribute('value', selectedService.price);

			let descriptionPrice = document.createElement('span');
			descriptionPrice.setAttribute('class','description-price');
			descriptionPrice.textContent = selectedService.price;

			document.querySelector('.services-description').appendChild(descriptionPrice);
			

		});

	});
});