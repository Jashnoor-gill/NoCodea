<!-- Common Components Template -->

<!-- Alert Component -->
<div class="alert alert-[data-v-type] alert-dismissible fade show" role="alert" data-v-if-alert>
    [data-v-message]
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>

<!-- Loading Spinner -->
<div class="d-flex justify-content-center" data-v-if-loading>
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">[data-v-t-loading]</span>
    </div>
</div>

<!-- Pagination Component -->
<nav aria-label="[data-v-t-pagination]" data-v-if-pagination>
    <ul class="pagination justify-content-center">
        [data-v-if-prevPage]
        <li class="page-item">
            <a class="page-link" href="[data-v-prevUrl]">[data-v-t-previous]</a>
        </li>
        [/data-v-if-prevPage]
        
        [data-v-loop-pages]
        <li class="page-item [data-v-if-current]active[/data-v-if-current]">
            <a class="page-link" href="[data-v-pageUrl]">[data-v-pageNumber]</a>
        </li>
        [/data-v-loop-pages]
        
        [data-v-if-nextPage]
        <li class="page-item">
            <a class="page-link" href="[data-v-nextUrl]">[data-v-t-next]</a>
        </li>
        [/data-v-if-nextPage]
    </ul>
</nav>

<!-- Breadcrumb Component -->
<nav aria-label="breadcrumb" data-v-if-breadcrumb>
    <ol class="breadcrumb">
        [data-v-loop-breadcrumbs]
        <li class="breadcrumb-item [data-v-if-active]active[/data-v-if-active]">
            [data-v-if-active][data-v-text][/data-v-if-active]
            [data-v-else]<a href="[data-v-url]">[data-v-text]</a>[/data-v-else]
        </li>
        [/data-v-loop-breadcrumbs]
    </ol>
</nav>

<!-- Modal Component -->
<div class="modal fade" id="[data-v-modalId]" tabindex="-1" data-v-if-modal>
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">[data-v-title]</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                [data-v-content]
            </div>
            <div class="modal-footer">
                [data-v-footer]
            </div>
        </div>
    </div>
</div>

<!-- Form Component -->
<form method="[data-v-method]" action="[data-v-action]" data-v-if-form>
    [data-v-csrf]
    [data-v-fields]
    <div class="d-grid gap-2">
        <button type="submit" class="btn btn-primary">[data-v-submitText]</button>
    </div>
</form>

<!-- Card Component -->
<div class="card h-100" data-v-if-card>
    [data-v-if-image]
    <img src="[data-v-image]" class="card-img-top" alt="[data-v-title]">
    [/data-v-if-image]
    <div class="card-body">
        <h5 class="card-title">[data-v-title]</h5>
        <p class="card-text">[data-v-description]</p>
        [data-v-if-button]
        <a href="[data-v-buttonUrl]" class="btn btn-primary">[data-v-buttonText]</a>
        [/data-v-if-button]
    </div>
</div> 